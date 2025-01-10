import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

export default function SlideTitleSpecial({
  title,
  icon,
}: {
  title: string;
  icon: LucideIcon | IconType;
}) {
  const Icon = icon;
  return (
    <div className="flex flex-row items-center space-x-1">
      <Icon className="w-16 h-16 text-black mr-4" />
      <h1 className="text-7xl text-black font-display">{title}</h1>
    </div>
  );
}
