import { BulletPointSlide } from "@/models/Quiz";
import { SlideTitle } from "@/slides/_components/SlideTitle";

export function Render({ slide }: { slide: BulletPointSlide }) {
    const hasImage = !!slide.imageUrl;

    const bulletPointsSection = (
        <div className="flex flex-col justify-center max-w-screen-lg px-8">
            <ul className="list-none" style={{ gap: `${slide.pointSpacing}px` }}>
                {slide.points.map((point, index) => (
                    <li 
                        key={index} 
                        className="flex items-center space-x-3"
                        style={{ 
                            fontSize: `${slide.fontSize}px`,
                            marginBottom: `${slide.pointSpacing}px`
                        }}
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary mr-2" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    const imageSection = hasImage && (
        <div className="flex-1 flex justify-center items-center">
            <div className="relative">
                <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-auto object-contain"
                    style={{
                        height: `${(slide.imageScale || 1) * 400}px`,
                        transition: "height 0.2s ease-out",
                    }}
                />
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col p-8">
            <SlideTitle title={slide.title} />
            <div className={`flex-1 flex ${hasImage ? 'gap-12' : ''} items-center justify-around mt-8`}>
                {slide.imagePosition === 'left' ? (
                    <>
                        {imageSection}
                        {bulletPointsSection}
                    </>
                ) : (
                    <>
                        {bulletPointsSection}
                        {imageSection}
                    </>
                )}
            </div>
        </div>
    );
} 