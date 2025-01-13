import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface BuzzerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function BuzzerButton({ children, disabled, className, ...props }: BuzzerButtonProps) {
  return (
    <button
      className={cn(
        'text-white p-2 rounded-full w-[50vw] aspect-square relative',
        'transform transition-transform active:scale-95',
        'shadow-[inset_0px_-8px_20px_rgba(0,0,0,0.3)]',
        disabled ? (
          'bg-gradient-to-b from-gray-400 to-gray-600 shadow-gray-700'
        ) : (
          [
            'bg-gradient-to-b from-green-400 to-green-600',
            'hover:from-green-300 hover:to-green-500',
            'shadow-[0_10px_30px_-10px_rgba(34,197,94,0.5)]',
            'before:absolute before:inset-[3%] before:rounded-full',
            'before:bg-gradient-to-b before:from-green-300/80 before:to-transparent',
            'before:pointer-events-none'
          ].join(' ')
        ),
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 text-xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
        {children}
      </span>
    </button>
  );
} 