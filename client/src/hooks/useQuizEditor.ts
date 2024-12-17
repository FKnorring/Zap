import { useState, useEffect, useCallback } from 'react';
import {
  type Slide,
  type SlideType,
  type QuestionType,
  QuizSettings,
  type Quiz,
} from '@/models/Quiz';
import { toast } from 'sonner';
import {
  quizDefaults,
  quizDefaultsBackgroundStyles,
} from '@/components/quiz-editor/utils/quiz-defaults';
import { getSlideComponentsFromType } from '@/slides/utils';
import { useAppContext } from '@/contexts/App/context';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

const DEFAULT_TIME_LIMIT = 0;
const SAVE_ON_N_ACTIONS = 50;
const SAVE_ON_LAST_ACTION = 30000; // 30 seconds

export function useQuizEditor(quizId: string | undefined) {
  const [error, setError] = useState<string | null>(null);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {
    quizzes: {
      optimisticUpdate,
      resources: quizzes,
      isLoading,
      enrichResource,
    },
  } = useAppContext();

  const { t } = useTranslation(['questions']);

  // Local state
  const [localQuiz, setLocalQuiz] = useState<Quiz | null>(null);
  const [, setActionCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [enriched, setEnriched] = useState(false);

  useEffect(() => {
    if (quizId) {
      enrichResource(quizId).then(() => setEnriched(true));
    }
  }, [quizId]);

  useEffect(() => {
    if (quizId && enriched) {
      const globalQuiz = quizzes.find((q) => q.id === quizId);
      if (globalQuiz) {
        setLocalQuiz(globalQuiz);
      }
    }
  }, [quizId, enriched, quizzes]);

  // Auto-save timer
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave(true);
    }, SAVE_ON_LAST_ACTION);

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, localQuiz]);

  // Track actions and trigger save
  const trackAction = useCallback(() => {
    setActionCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= SAVE_ON_N_ACTIONS) {
        handleSave(true);
        return 0;
      }
      return newCount;
    });
    setHasUnsavedChanges(true);
  }, []);

  // Save all slides
  const handleSave = async (autoSave: boolean = false) => {
    if (!quizId || !localQuiz) return;
    setIsSaving(true);

    const savePromise = new Promise((resolve, reject) => {
      optimisticUpdate(quizId, localQuiz)
        .then(({ error: saveError }) => {
          if (saveError) {
            setError(saveError.message);
            reject(saveError.message);
            return false;
          }
          setHasUnsavedChanges(false);
          setActionCount(0);
          resolve(
            autoSave
              ? 'Quiz auto-saved successfully'
              : 'Quiz saved successfully'
          );
          return true;
        })
        .catch(reject)
        .finally(() => setIsSaving(false));
    });

    if (!autoSave) {
      toast.promise(savePromise, {
        loading: 'Saving quiz...',
        success: 'Quiz saved successfully',
        error: (err) => `Error: ${err}`,
      });
    } else {
      toast.promise(savePromise, {
        loading: 'Auto-saving quiz...',
        success: 'Quiz auto-saved successfully',
        error: (err) => `Auto-save error: ${err}`,
      });
    }
  };

  const handleAddSlide = (
    type: SlideType,
    questionType?: QuestionType,
    index?: number
  ) => {
    if (!quizId || !localQuiz) return;

    let backgroundStyle =
      localQuiz.settings?.backgroundStyleDefault ??
      quizDefaults.backgroundStyleDefault;

    if (backgroundStyle === 'random') {
      const randomBackgroundStyle =
        quizDefaultsBackgroundStyles[
          Math.floor(Math.random() * quizDefaultsBackgroundStyles.length)
        ];
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
      ...(questionType
        ? {
            questionType,
            timeLimit: DEFAULT_TIME_LIMIT,
            showCorrectAnswer:
              localQuiz?.settings?.showCorrectAnswerDefault ??
              quizDefaults.showCorrectAnswerDefault,
          }
        : {}),
      title: t(SlideInfo.label),
    } as Slide;

    setLocalQuiz((prev) =>
      prev
        ? {
            ...prev,
            slides: index
              ? [
                  ...prev.slides?.slice(0, index),
                  newSlide,
                  ...prev.slides?.slice(index),
                ]
              : [...(prev?.slides || []), newSlide],
          }
        : null
    );
    setActiveSlideId(newSlide.id);
    trackAction();
  };

  const handleSlideUpdate = (updatedSlide: Slide) => {
    if (!quizId || !localQuiz) return;
    setLocalQuiz((prev) =>
      prev
        ? {
            ...prev,
            slides: prev.slides.map((slide) =>
              slide.id === updatedSlide.id ? updatedSlide : slide
            ),
          }
        : null
    );
    trackAction();
  };

  const handleSlideDelete = (slideId: string) => {
    if (!quizId || !localQuiz) return;
    setLocalQuiz((prev) =>
      prev
        ? {
            ...prev,
            slides: prev.slides.filter((slide) => slide.id !== slideId),
          }
        : null
    );
    if (activeSlideId === slideId) {
      setActiveSlideId(
        localQuiz?.slides.find((s) => s.id !== slideId)?.id ?? null
      );
    }
    trackAction();
  };

  const handleSlideDuplicate = (slideId: string) => {
    if (!quizId || !localQuiz) return;

    const currentIndex =
      localQuiz?.slides.findIndex((slide) => slide.id === slideId) || 0;
    const slideToClone = localQuiz?.slides[currentIndex];
    if (!slideToClone) return;

    const newSlide = {
      ...slideToClone,
      id: nanoid(),
      title: `${slideToClone.title} (Copy)`,
      backgroundStyle:
        slideToClone.backgroundStyle ||
        localQuiz.settings?.backgroundStyleDefault ||
        quizDefaults.backgroundStyleDefault,
    };

    setLocalQuiz((prev) => {
      if (!prev) return null;
      const newSlides = [...prev.slides];
      newSlides.splice(currentIndex + 1, 0, newSlide as never);
      return { ...prev, slides: newSlides };
    });
    setActiveSlideId(newSlide.id);
    trackAction();
  };

  const handleSlideMove = (slideId: string, direction: 'up' | 'down') => {
    if (!quizId || !localQuiz) return;

    const currentIndex = localQuiz?.slides.findIndex(
      (slide) => slide.id === slideId
    );
    if (currentIndex === -1 || currentIndex === undefined) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= (localQuiz?.slides.length || 0)) return;

    setLocalQuiz((prev) => {
      if (!prev) return null;
      const newSlides = [...prev.slides];
      [newSlides[currentIndex], newSlides[newIndex]] = [
        newSlides[newIndex],
        newSlides[currentIndex],
      ];
      return { ...prev, slides: newSlides };
    });
    trackAction();
  };

  const handleQuizUpdate = async (updates: {
    quizName?: string;
    settings?: QuizSettings;
  }) => {
    if (!quizId || !localQuiz) return;

    setLocalQuiz((prev) =>
      prev
        ? {
            ...prev,
            quiz_name: updates.quizName ?? prev.quiz_name,
            settings: {
              ...quizDefaults,
              ...prev.settings,
              ...updates.settings,
            },
          }
        : null
    );
    trackAction();
  };

  const handleSlideSwap = (activeId: string, overId: string) => {
    if (!quizId || !localQuiz || activeId === overId) return;

    setLocalQuiz((prev) => {
      if (!prev) return null;

      const oldIndex = prev.slides.findIndex((slide) => slide.id === activeId);
      const newIndex = prev.slides.findIndex((slide) => slide.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newSlides = [...prev.slides];
      const [movedSlide] = newSlides.splice(oldIndex, 1);
      newSlides.splice(newIndex, 0, movedSlide);

      return {
        ...prev,
        slides: newSlides,
      };
    });
    trackAction();
  };

  const activeSlide =
    localQuiz?.slides?.find((slide) => slide.id === activeSlideId) ?? null;

  return {
    quiz: localQuiz,
    error,
    slides: localQuiz?.slides || [],
    activeSlide,
    activeSlideId,
    showSettings,
    isLoading,
    isSaving,
    hasUnsavedChanges,
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
    handleSlideSwap,
  };
}
