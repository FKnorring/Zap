import { useState, useEffect } from 'react';
import type { Slide } from '@/models/Quiz';

interface UseSlideSidebarProps {
  slides: Slide[];
  activeSlideId: string | null;
  onSlideSelect: (slideId: string) => void;
}

export function useSlideSidebar({ slides, activeSlideId, onSlideSelect }: UseSlideSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<number | null>(null);
  const [isOverMenu, setIsOverMenu] = useState(false);

  const handleMouseEnter = (index: number | null) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    const timeoutId = window.setTimeout(() => {
      setIsOpen(true);
      setInsertIndex(index);
    }, 300);
    setHoverTimeout(timeoutId);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (!isOverMenu) {
      const timeoutId = window.setTimeout(() => {
        setIsOpen(false);
      }, 300);
      setCloseTimeout(timeoutId);
    }
  };

  const handleMenuMouseEnter = () => {
    setIsOverMenu(true);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleMenuMouseLeave = () => {
    setIsOverMenu(false);
    const timeoutId = window.setTimeout(() => {
      setIsOpen(false);
    }, 300);
    setCloseTimeout(timeoutId);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [hoverTimeout, closeTimeout]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeSlideId || !document.activeElement?.closest('.slides-container')) return;

      const currentIndex = slides.findIndex((slide) => slide.id === activeSlideId);
      if (currentIndex === -1) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          if (currentIndex > 0) {
            e.preventDefault();
            onSlideSelect(slides[currentIndex - 1].id);
          }
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          if (currentIndex < slides.length - 1) {
            e.preventDefault();
            onSlideSelect(slides[currentIndex + 1].id);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideId, slides, onSlideSelect]);

  return {
    isOpen,
    setIsOpen,
    insertIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleMenuMouseEnter,
    handleMenuMouseLeave,
  };
} 