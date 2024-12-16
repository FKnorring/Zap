import { LucideIcon } from "lucide-react";

export default function SlideTitleSpecial({ title, icon }: { title: string, icon: LucideIcon }) {
  const Icon = icon;
  return (
    <div className="flex flex-row items-center space-x-1">
      <Icon className="w-16 h-16 text-black" />
      <h1 className="text-7xl text-black font-display">{title}</h1>
    </div>
  )
}