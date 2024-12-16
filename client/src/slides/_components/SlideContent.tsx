import { WiggleText } from "@/components/WiggleText";

interface SlideContentProps {
    content?: string;
    wiggle?: boolean;
}

export function SlideContent({ content, wiggle = false }: SlideContentProps) {
    if (!content) return null;

    const className = "md:text-[40px] text-[20px] text-center leading-normal font-display";
    
    return wiggle ? (
        <WiggleText className={className} text={content} />
    ) : (
        <p className={className}>{content}</p>
    );
} 