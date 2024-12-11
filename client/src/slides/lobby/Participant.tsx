import { LobbySlide } from '@/models/Quiz';

export function Participant({ slide }: { slide: LobbySlide }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-display text-center">
        Waiting for the host to start the game... {slide.title}
      </h1>
    </div>
  );
}
