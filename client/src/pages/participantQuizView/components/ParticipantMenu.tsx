import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, Languages, LogIn } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import LanguageRadio from '@/components/Settings/LanguageRadio';

interface ParticipantMenuProps {
  onLeave: () => void; // This will call handleRemoveParticipant from parent
}

export default function ParticipantMenu({ onLeave }: ParticipantMenuProps) {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="p-2 flex items-center">
          {t('participants:menu')}
          <ChevronDown
            className="w-4 h-4"
            style={{
              transition: 'transform 0.2s ease',
              transform: popoverOpen ? 'rotate(180deg)' : 'none',
            }}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-3">
        <div className="space-y-2 font-display">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between px-2 py-2"
            onClick={() => setLangOpen(!langOpen)}
          >
            <div className="flex items-center">
              <Languages className="w-4 h-4 mr-2" />
              {t('general:language')}
            </div>
            <ChevronDown
              className="w-4 h-4"
              style={{
                transition: 'transform 0.2s ease',
                transform: langOpen ? 'rotate(180deg)' : 'none',
              }}
            />
          </Button>

          {langOpen && (
            <div className="rounded bg-gray-100 p-2">
              <LanguageRadio setOpen={setLangOpen} />
            </div>
          )}

          <Dialog>
            <DialogTrigger className="flex w-full items-center gap-2">
              <Button className="gap-1 w-full text-red-500" variant="outline">
                <LogIn className="transform rotate-180" />
                {t('participants:leave')}
              </Button>
            </DialogTrigger>
            <DialogContent
              onClick={(e) => e.stopPropagation()}
              className="w-4/5 rounded-lg"
            >
              <DialogHeader className="text-black">
                <DialogTitle>{t('participants:leaveTitle')}</DialogTitle>
                <DialogDescription>
                  {t('participants:leaveDescription')}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex justify-end gap-2 mt-4">
                  <DialogClose asChild>
                    <Button variant="outline" className="text-black">
                      {t('general:cancel')}
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLeave();
                      }}
                    >
                      {t('participants:leave')}
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
