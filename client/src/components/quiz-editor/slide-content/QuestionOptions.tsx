import { cn } from "@/lib/utils";
import { Circle, CheckCircle2 } from "lucide-react";

interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface QuestionOptionsProps {
    options: Option[];
    type: "MCQSA" | "MCQMA" |"rank";
}

export function QuestionOptions({ options, type }: QuestionOptionsProps) {
    return (
        // if type "MCQSA" | "MCQMA"
        <div className="grid grid-cols-2 gap-8 w-full">
            {options.map((option) => (
                <div 
                    key={option.id}
                    className="flex items-center gap-4 text-[40px] p-6 rounded-xl bg-white/10 backdrop-blur outline outline-white/50"
                >
                    {type === 'MCQSA' ? (
                        <Circle className={cn(
                            "w-8 h-8",
                            option.isCorrect && "text-green-500"
                        )} />
                    ) : (
                        <CheckCircle2 className={cn(
                            "w-8 h-8",
                            option.isCorrect && "text-green-500"
                        )} />
                    )}
                    <span>{option.text}</span>
                </div>
            ))}
        </div>
        // If typ rank 
    );
} 