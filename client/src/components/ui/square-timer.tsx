import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  progress: number; // 0-100
  className?: string;
}

export const SquareTimer: React.FC<Props> = ({ progress, className }) => {
  const squareOrder = useMemo(() => [
    0, 8, 1, 7, 2, 6, 3, 5, 4
  ], []);

  const filledSquares = Math.floor((progress / 100) * 9);

  return (
    <div className={cn("flex gap-2 w-fit", className)}>
      {Array.from({ length: 9 }).map((_, index) => {
        const orderIndex = squareOrder.indexOf(index);
        const shouldBeFilled = orderIndex >= 9 - filledSquares;

        return (
          <motion.div
            key={index}
            className={cn(
              "w-8 h-8 rounded-sm relative",
              // 3D border effect
              "border-2 border-white/50",
              "shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4),inset_-1px_-1px_1px_rgba(0,0,0,0.4)]",
              shouldBeFilled ? [
                // Lit state
                "bg-gradient-to-br from-white via-white/90 to-white/80",
                // Glow effect
                "after:absolute after:inset-[-8px] after:rounded-md after:bg-white/30",
                "after:blur-[8px] after:z-[-1]",
                // Inner light reflection
                "before:absolute before:inset-[2px] before:rounded-[2px]",
                "before:bg-gradient-to-br before:from-white before:to-transparent",
                "before:opacity-60"
              ].join(' ') : [
                // Unlit state
                "bg-transparent",
                "backdrop-blur-sm",
                "bg-white/5"
              ].join(' ')
            )}
            initial={false}
            animate={{
              scale: shouldBeFilled ? [1.2, 1] : 1,
              rotate: shouldBeFilled ? [10, 0] : 0,
            }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          />
        );
      })}
    </div>
  );
}; 