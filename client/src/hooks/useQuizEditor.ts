import { useState, useEffect } from 'react';
import { quizService } from '@/services/quizzes';
import type Quiz from '@/models/Quiz';
import type { Slide, SlideType, QuestionType } from '@/models/Quiz';
import { toast } from 'sonner';

export function useQuizEditor(quizId: string | undefined) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch quiz and slides
    useEffect(() => {
        async function fetchQuizAndSlides() {
            if (!quizId) return;
            setIsLoading(true);
            
            try {
                const { data, error } = await quizService.getById(quizId)

                if (error) {
                    setError(error.message);
                    return;
                }
                setQuiz(data);
                setActiveSlideId(data?.slides?.[0]?.id || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuizAndSlides();
    }, [quizId]);

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
        const baseSlide = {
            id: crypto.randomUUID(),
            title: `New ${type} slide`,
            content: '',
            backgroundStyle: 'waves' as const,
        };

        let newSlide: Slide;

        switch (type) {
            case 'info':
                newSlide = {
                    ...baseSlide,
                    type: 'info',
                };
                break;
            case 'score':
                newSlide = {
                    ...baseSlide,
                    type: 'score',
                    mockScores: [
                        { name: 'Player 1', points: 100, newPoints: 120 },
                        { name: 'Player 2', points: 80, newPoints: 121 },

                        
                    ],
                };
                break;
            
            
            case 'question':
                if (!questionType) throw new Error('Question type is required');

                switch (questionType) {
                    case 'MCQSA':
                        newSlide = {
                            ...baseSlide,
                            type: 'question',
                            questionType: 'MCQSA',
                            timeLimit: 0,
                            options: Array.from({ length: 4 }, (_, i) => ({
                                id: crypto.randomUUID(),
                                text: `Option ${i + 1}`,
                                isCorrect: i === 0,
                            })),
                        };
                        break;
                    case 'MCQMA':
                        newSlide = {
                            ...baseSlide,
                            type: 'question',
                            questionType: 'MCQMA',
                            timeLimit: 0,
                            options: Array.from({ length: 4 }, (_, i) => ({
                                id: crypto.randomUUID(),
                                text: `Option ${i + 1}`,
                                isCorrect: i <= 1,
                            })),
                        };
                        break;
                    case 'FA':
                        newSlide = {
                            ...baseSlide,
                            type: 'question',
                            questionType: 'FA',
                            timeLimit: 0,
                            correctAnswer: '',
                        };
                        break;

                    case 'rank':
                        newSlide = {
                            ...baseSlide,
                            type: 'question',
                            questionType: "rank",
                            timeLimit: 0,
                            ranking: []
            
                        };
                        break;    
            
                    default:
                        throw new Error('Invalid question type');
                }
                break;
            default:
                throw new Error('Invalid slide type');
        }

        setQuiz(prev => prev ? { ...prev, slides: [...(prev.slides || []), newSlide] } : null);
        setActiveSlideId(newSlide.id);
    };

    const handleSlideUpdate = (updatedSlide: Slide) => {
        
        setQuiz(prev => prev ? { ...prev, slides: prev.slides.map(slide =>
            slide.id === updatedSlide.id ? updatedSlide : slide
        ) } : null);
    };

    const handleSlideDelete = (slideId: string) => {
        setQuiz(prev => prev ? { ...prev, slides: prev.slides.filter(slide => slide.id !== slideId) } : null);
        if (activeSlideId === slideId) {
            setActiveSlideId(quiz?.slides.find(s => s.id !== slideId)?.id ?? null);
        }
    };

    const handleSlideDuplicate = (slideId: string) => {
        const currentIndex = quiz?.slides.findIndex(slide => slide.id === slideId) || 0;
        const slideToClone = quiz?.slides[currentIndex];
        if (!slideToClone) return;

        const newSlide = {
            ...slideToClone,
            id: crypto.randomUUID(),
            title: `${slideToClone.title} (Copy)`,
            backgroundStyle: slideToClone.backgroundStyle || 'waves',
        };

        const newSlides = [...quiz?.slides || []];
        newSlides.splice(currentIndex + 1, 0, newSlide);
        setQuiz(prev => prev ? { ...prev, slides: newSlides } : null);
        setActiveSlideId(newSlide.id);
    };

    const handleSlideMove = (slideId: string, direction: 'up' | 'down') => {
        const currentIndex = quiz?.slides.findIndex(slide => slide.id === slideId);
        if (currentIndex === -1 || currentIndex === undefined) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= (quiz?.slides.length || 0)) return;

        const newSlides = [...quiz?.slides || []];
        [newSlides[currentIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentIndex]];
        setQuiz(prev => prev ? { ...prev, slides: newSlides } : null);
    };

    const handleQuizUpdate = async (updates: {
        quizName?: string;
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
    }) => {
        if (!quiz || !quizId) return;

        const updatedQuiz = {
            ...quiz,
            quiz_name: updates.quizName ?? quiz.quiz_name,
            primary_color: updates.primaryColor ?? quiz.primary_color ?? "#006a67",
            secondary_color: updates.secondaryColor ?? quiz.secondary_color ?? "#fff4b7",
            background_color: updates.backgroundColor ?? quiz.background_color ?? "#000B58",
        };

        setQuiz(updatedQuiz);
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