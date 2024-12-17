import { createContext, useContext, ReactNode } from 'react';
import type { Slide, SlideTypes, QuestionTypes } from '@/models/Quiz';
import { useSlideSidebar } from './useSlideSidebar';

interface SlideSidebarContextType {
  // Quiz data
  quizName: string;
  slides: Slide[];
  activeSlideId: string | null;
  
  // Theme colors
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  
  // State
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  insertIndex: number | null;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  
  // Callbacks
  onSlideSelect: (slideId: string) => void;
  onSlideDelete: (slideId: string) => void;
  onSlideDuplicate: (slideId: string) => void;
  onSlideMove: (slideId: string, direction: 'up' | 'down') => void;
  onSlideSwap: (activeId: string, overId: string) => void;
  onAddSlide: (type: SlideTypes, questionType?: QuestionTypes, index?: number) => void;
  onSettingsClick: () => void;
  onSaveClick: () => void;
  
  // Mouse handlers
  handleMouseEnter: (index: number | null) => void;
  handleMouseLeave: () => void;
  handleMenuMouseEnter: () => void;
  handleMenuMouseLeave: () => void;
}

const SlideSidebarContext = createContext<SlideSidebarContextType | null>(null);

interface SlideSidebarProviderProps extends Omit<SlideSidebarContextType, 
  'isOpen' | 'setIsOpen' | 'insertIndex' | 
  'handleMouseEnter' | 'handleMouseLeave' | 
  'handleMenuMouseEnter' | 'handleMenuMouseLeave'> {
  children: ReactNode;
}

export function SlideSidebarProvider({
  children,
  slides,
  activeSlideId,
  onSlideSelect,
  ...props
}: SlideSidebarProviderProps) {
  const {
    isOpen,
    setIsOpen,
    insertIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleMenuMouseEnter,
    handleMenuMouseLeave,
  } = useSlideSidebar({
    slides,
    activeSlideId,
    onSlideSelect,
  });

  return (
    <SlideSidebarContext.Provider
      value={{
        slides,
        activeSlideId,
        isOpen,
        setIsOpen,
        insertIndex,
        onSlideSelect,
        handleMouseEnter,
        handleMouseLeave,
        handleMenuMouseEnter,
        handleMenuMouseLeave,
        ...props,
      }}
    >
      {children}
    </SlideSidebarContext.Provider>
  );
}

export function useSlideSidebarContext() {
  const context = useContext(SlideSidebarContext);
  if (!context) {
    throw new Error('useSlideSidebarContext must be used within a SlideSidebarProvider');
  }
  return context;
} 