import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown, Wrench, CircleDot, DicesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Tools() {
  const { t } = useTranslation();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Popover open={isToolsOpen} onOpenChange={setIsToolsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-lg flex flex-row items-center">
          {t('general:tools')}
          <ChevronDown
            className="w-4 h-4"
            strokeWidth={3}
            style={{
              transition: 'transform 0.2s ease',
              transform: isToolsOpen ? `rotate(180deg)` : 'none',
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3">
        <div className="grid gap-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/tools/team-generator');
              setIsToolsOpen(false);
            }}
          >
            <Wrench className="w-4 h-4 mr-2" strokeWidth={3} />
            {t('general:teamGenerator')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/tools/spin-wheel');
              setIsToolsOpen(false);
            }}
          >
            <CircleDot className="w-4 h-4 mr-2" strokeWidth={3} />
            {t('general:spinWheel')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/tools/random-number');
              setIsToolsOpen(false);
            }}
          >
            <DicesIcon className="w-4 h-4 mr-2" strokeWidth={3} />
            {t('general:randomNumber')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 