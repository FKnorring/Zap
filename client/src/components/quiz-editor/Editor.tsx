import { SlideTypes, type Slide } from '@/models/Quiz';
import { SlidePreview } from './SlidePreview';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface EditorProps {
  slide: Slide | null;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  onSlideUpdate: (slide: Slide) => void;
}

export function Editor({
  slide,
  backgroundColor,
  primaryColor,
  secondaryColor,
  onSlideUpdate,
}: EditorProps) {
  const [whichPreview, setWhichPreview] = useState('Preview');
  const { t } = useTranslation();

  if (!slide) {
    return (
      <div className="h-full flex items-center justify-center text-muted font-medium">
        {t('quizEditor:selectSlide')}
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-center space-x-4">
        <Tabs
          value={whichPreview}
          onValueChange={setWhichPreview}
          className="pb-2"
        >
          <TabsList>
            <TabsTrigger value="Preview">{t('general:preview')}</TabsTrigger>
            <TabsTrigger value="Host">{t('general:host')}</TabsTrigger>
            {slide.type !== SlideTypes.info && (
              <>
                <TabsTrigger value="Participant">
                  {t('general:participant')}
                </TabsTrigger>
                <TabsTrigger value="HostAnswer">
                  {t('general:hostAnswer')}
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex items-center justify-center bg-card/30 rounded-lg p-4">
        <div
          className={cn(
            'w-full',
            whichPreview === 'Participant' ? 'max-w-md' : 'max-w-4xl'
          )}
        >
          <SlidePreview
            slide={slide}
            backgroundColor={backgroundColor}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            whichPreview={whichPreview}
            onSlideUpdate={onSlideUpdate}
          />
        </div>
      </div>
    </div>
  );
}
