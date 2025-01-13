import { Button } from '@/components/ui/button';
import { MinusIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ImageIcon } from 'lucide-react';
import { ToolbarProps } from '../../toolbar';
import { Slider } from '@/components/ui/slider';
import { Slide } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';

export default function ImageInput<T extends Slide>({
  slide,
  onSlideUpdate,
}: ToolbarProps<T>) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onSlideUpdate({
        ...slide,
        imageUrl: reader.result as string,
        imageScale: 1,
      });
    };
    reader.readAsDataURL(file);
  };
  const { t } = useTranslation(['quizEditor']);

  return (
    <>
      <div className="space-y-1">
        <div className="flex flex-row items-center space-x-1">
          <ImageIcon size={16} />
          <Label>{t('image')}</Label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="image-upload-button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {slide.imageUrl ? t('changeImage') : t('addImage')}
          </Button>
          {slide.imageUrl && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onSlideUpdate({ ...slide, imageUrl: '' })}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      {slide.imageUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t('imageScale')}</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round((slide.imageScale || 1) * 100)}%
            </span>
          </div>
          <Slider
            value={[(slide.imageScale || 1) * 100]}
            onValueChange={([value]) =>
              onSlideUpdate({
                ...slide,
                imageScale: value / 100,
              })
            }
            min={10}
            max={200}
            step={5}
            className="w-full"
          />
        </div>
      )}
    </>
  );
}
