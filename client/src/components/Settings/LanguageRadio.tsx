import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { languages } from '@/config/languages';

interface LanguageRadioProps {
  setOpen: (open: boolean) => void;
}

export default function LanguageRadio({ setOpen }: LanguageRadioProps) {
  const { t, i18n } = useTranslation(['general']);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <RadioGroup defaultValue={i18n.language}>
      {languages.map((language) => (
        <div key={language.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={language.value}
            id={language.value}
            onClick={() => handleLanguageChange(language.value)}
          />
          <Label className="cursor-pointer" htmlFor={language.value}>
            {t(language.name)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
