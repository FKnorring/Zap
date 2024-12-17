import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SlideOptionProps {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
}

export function SlideOption({ label, icon: Icon, onClick }: SlideOptionProps) {
    return (
        <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onClick}
        >
            <Icon className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
} 