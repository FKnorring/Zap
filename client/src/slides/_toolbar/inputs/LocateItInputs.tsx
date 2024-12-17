import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LocateItSlide, mapDetails, awardPointsLocation } from '@/models/Quiz';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Map,
  MoveHorizontal,
  MoveVertical,
  Radius,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LocateItInputs({
  slide,
  onSlideUpdate,
}: {
  slide: LocateItSlide;
  onSlideUpdate: (slide: LocateItSlide) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const handleLocationChange = (type: 'lat' | 'lng', value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue)) return; // Ignore invalid number input
    if (type === 'lat' && (numberValue < -90 || numberValue > 90)) return; // Latitude range
    if (type === 'lng' && (numberValue < -180 || numberValue > 180)) return; // Longitude range

    const updatedSlide = {
      ...slide,
      location: { ...slide.location, [type]: numberValue },
    };
    onSlideUpdate(updatedSlide);
  };

  const { t } = useTranslation(['quizEditor']);

  const handleSelectChange = (type: 'map' | 'points', value: string) => {
    if (type === 'map') {
      const updatedSlide = {
        ...slide,
        mapDetails: value as mapDetails,
      };
      onSlideUpdate(updatedSlide);
    } else {
      const updatedSlide = {
        ...slide,
        awardPointsLocation: value as awardPointsLocation,
      };
      onSlideUpdate(updatedSlide);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="block text-lg font-semibold">
        {t('locateitSettings')}
      </Label>
      <div className="flex flex-col space-y-2">
        <div className="space-y-1">
          <div className="flex flex-row items-center space-x-1">
            <Map size={17} />
            <Label>{t('mapDetails')}</Label>
          </div>
          <Select
            value={slide.mapDetails}
            onValueChange={(value) => handleSelectChange('map', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(() => {
                  switch (slide.mapDetails) {
                    case 'NONE':
                      return t('none');
                    case 'MEDIUM':
                      return t('medium');
                    case 'HIGH':
                      return t('high');
                    default:
                      return 'Select Map Details';
                  }
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">
                <h1 className="font-bold">{t('none')}</h1>
                <h1>{t('noneDescription')}</h1>
              </SelectItem>
              <SelectItem value="MEDIUM">
                <h1 className="font-bold">{t('medium')}</h1>
                <h3>{t('mediumDescription')}</h3>
              </SelectItem>
              <SelectItem value="HIGH">
                <h1 className="font-bold">{t('high')}</h1>
                <h3>{t('highDescription')}</h3>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <div className="flex flex-row items-center space-x-1">
            <Trophy size={17} />
            <Label>{t('awardPoints')}</Label>
          </div>
          <Select
            value={slide.awardPointsLocation}
            onValueChange={(value) => handleSelectChange('points', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(() => {
                  switch (slide.awardPointsLocation) {
                    case 'RADIUS':
                      return t('insideRadius');
                    case 'DISTANCE':
                      return t('distance');
                    case 'CLOSEST':
                      return t('closestWins');
                    default:
                      return t('select') + ' ' + t('points');
                  }
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DISTANCE">
                <h1 className="font-bold">{t('distance')}</h1>
                <h3>{t('distanceDescription')}</h3>
              </SelectItem>
              <SelectItem value="RADIUS">
                <h1 className="font-bold">{t('insideRadius')}</h1>
                <h3>{t('insideRadiusDescription')}</h3>
              </SelectItem>
              <SelectItem value="CLOSEST">
                <h1 className="font-bold">{t('closestWins')}</h1>
                <h3>{t('closestWinsDescription')}</h3>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="justify-start p-2 "
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? <ChevronDown /> : <ChevronUp />}
          {t('showAdvanced')}
        </Button>
        {showAdvanced && (
          <div className="px-2 bg-white rounded-md pb-2">
            {slide.awardPointsLocation !== 'CLOSEST' && (
              <div className="flex flex-col space-y-1 ">
                <div className="flex flex-row items-center pt-2 space-x-1">
                  <Radius size={15} />
                  <Label>{t('radius')}</Label>
                </div>
                <Input
                  value={slide.radius}
                  type="number"
                  onChange={(e) => {
                    const numberValue = Number(e.target.value);
                    const updatedSlide = {
                      ...slide,
                      radius: numberValue,
                    };
                    onSlideUpdate(updatedSlide);
                  }}
                  placeholder={t('enterCorrectAnswer') + '...'}
                />
              </div>
            )}

            <div className="flex flex-row items-center pt-2 space-x-1 pb-1">
              <MoveHorizontal size={15} />
              <Label>{t('latitude')}</Label>
            </div>
            <Input
              type="number"
              value={slide.location.lat}
              onChange={(e) => handleLocationChange('lat', e.target.value)}
              placeholder="Enter latitude (-90 to 90)"
            />
            <div className="flex flex-row items-center pt-2 space-x-1 pb-1">
              <MoveVertical size={15} />
              <Label>{t('longitude')}</Label>
            </div>
            <Input
              type="number"
              value={slide.location.lng}
              onChange={(e) => handleLocationChange('lng', e.target.value)}
              placeholder="Enter longitude (-180 to 180)"
            />
          </div>
        )}
      </div>
    </div>
  );
}
