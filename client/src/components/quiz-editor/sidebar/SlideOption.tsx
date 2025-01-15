import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

interface SlideOptionProps {
  label: string;
  icon: LucideIcon | IconType;
  iconColor?: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SlideOption({
  label,
  icon: Icon,
  onClick,
  iconColor,
  disabled,
}: SlideOptionProps) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="mr-1" strokeWidth={3} color={iconColor} />
      {label}
    </Button>
  );
}
