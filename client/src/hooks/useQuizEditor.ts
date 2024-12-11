import { useState } from 'react';
import { quizService } from '@/services/quizzes';
import { type Slide, type SlideType, type QuestionType, QuizSettings } from '@/models/Quiz';
import { toast } from 'sonner';
import { quizDefaults, quizDefaultsBackgroundStyles } from '@/components/quiz-editor/utils/quiz-defaults';
import { getSlideComponentsFromType } from '@/slides/utils';
import { useAppContext } from '@/contexts/App/context';
import {nanoid} from 'nanoid'

const DEFAULT_TIME_LIMIT = 0;

export function useQuizEditor(quizId: string | undefined) {
    const [error, setError] = useState<string | null>(null);
    const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { quizzes: { optimisticUpdate, resources: quizzes, isLoading } } = useAppContext();
    const quiz = quizzes.find(q => q.id === quizId);

    // Save all slides
    const handleSave = async () => {
        if (!quizId || !quiz) return;
        setIsSaving(true);

        const savePromise = new Promise((resolve, reject) => {
            quizService.update(quizId, quiz)
                .then(({ error: saveError }) => {
                    if (saveError) {
                        setError(saveError.message);
                        reject(saveError.message);
                        return false;
                    }
                    resolve('Slides saved successfully');
                    return true;
                })
                .catch(reject);
        });

        toast.promise(savePromise, {
            loading: 'Saving slides...',
            success: 'Slides saved successfully',
            error: (err) => `Error: ${err}`
        });
    };

    const handleAddSlide = (type: SlideType, questionType?: QuestionType) => {
        if (!quizId || !quiz) return;


        let backgroundStyle = quiz.settings?.backgroundStyleDefault ?? quizDefaults.backgroundStyleDefault;

        if (backgroundStyle === 'random') {
            const randomBackgroundStyle = quizDefaultsBackgroundStyles[Math.floor(Math.random() * quizDefaultsBackgroundStyles.length)];
            backgroundStyle = randomBackgroundStyle;
        }

        const baseSlide = {
            id: nanoid(),
            title: `New ${type} slide`,
            content: '',
            backgroundStyle,
            type,
        };

        const SlideInfo = getSlideComponentsFromType(type, questionType).Info;

        const newSlide = {
            ...baseSlide,
            ...SlideInfo.defaults,
            ...(questionType ? {
                questionType,
                timeLimit: DEFAULT_TIME_LIMIT,
                showCorrectAnswer: quiz?.settings?.showCorrectAnswerDefault ?? quizDefaults.showCorrectAnswerDefault
            } : {}),
        } as Slide;

        optimisticUpdate(quizId, { slides: [...(quiz.slides || []), newSlide] });
        setActiveSlideId(newSlide.id);
    };

    const handleSlideUpdate = (updatedSlide: Slide) => {
        if (!quizId || !quiz) return;
        optimisticUpdate(quizId, { slides: quiz.slides.map(slide =>
            slide.id === updatedSlide.id ? updatedSlide : slide
            )
        }).then((res) => {
            if (res.error) {
                toast.error(`Error updating slide: ${res.error.message}`);
            }
        });
    };

    const handleSlideDelete = (slideId: string) => {
        if (!quizId || !quiz) return;
        optimisticUpdate(quizId, { slides: quiz.slides.filter(slide => slide.id !== slideId) });
        if (activeSlideId === slideId) {
            setActiveSlideId(quiz?.slides.find(s => s.id !== slideId)?.id ?? null);
        }
    };

    const handleSlideDuplicate = (slideId: string) => {
        if (!quizId || !quiz) return;

        const currentIndex = quiz?.slides.findIndex(slide => slide.id === slideId) || 0;
        const slideToClone = quiz?.slides[currentIndex];
        if (!slideToClone) return;

        const newSlide = {
            ...slideToClone,
            id: nanoid(),
            title: `${slideToClone.title} (Copy)`,
            backgroundStyle: slideToClone.backgroundStyle || quiz.settings?.backgroundStyleDefault || quizDefaults.backgroundStyleDefault,
        };

        const newSlides = [...quiz?.slides || []];
        newSlides.splice(currentIndex + 1, 0, newSlide as never);
        optimisticUpdate(quizId, { slides: newSlides });
        setActiveSlideId(newSlide.id);
    };

    const handleSlideMove = (slideId: string, direction: 'up' | 'down') => {
        if (!quizId || !quiz) return;

        const currentIndex = quiz?.slides.findIndex(slide => slide.id === slideId);
        if (currentIndex === -1 || currentIndex === undefined) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= (quiz?.slides.length || 0)) return;

        const newSlides = [...quiz?.slides || []];
        [newSlides[currentIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentIndex]];
        optimisticUpdate(quizId, { slides: newSlides });
    };

    const handleQuizUpdate = async (updates: {
        quizName?: string;
        settings?: QuizSettings;
    }) => {
        if (!quizId || !quiz) return;

        const updatedQuiz = {
            ...quiz,
            quiz_name: updates.quizName ?? quiz.quiz_name,
            settings: {
                ...quizDefaults,
                ...quiz.settings,
                ...updates.settings,
            },
        };

        optimisticUpdate(quizId, updatedQuiz);
    };

    const activeSlide = quiz?.slides?.find(slide => slide.id === activeSlideId) ?? null;

    return {
        quiz,
        error,
        slides: quiz?.slides || [],
        activeSlide,
        activeSlideId,
        showSettings,
        isLoading,
        isSaving,
        handleAddSlide,
        handleSlideUpdate,
        handleSlideDelete,
        handleSlideDuplicate,
        handleSlideMove,
        handleQuizUpdate,
        handleSave,
        setActiveSlideId,
        setShowSettings,
        setError,
    };
} 