import { ScoreSlide, Participant, Slide } from '@/models/Quiz';
import { SlideTitle } from '@/slides/_components/SlideTitle';
import ScoreBoard from '@/slides/_components/Scoreboard';

const mockParticipants: Participant[] = [
  {
    answers: [
      { slideNumber: 1, answer: ['Yes'], time: '2024-11-18T10:05:00Z' },
      { slideNumber: 2, answer: ['No'], time: '2024-11-18T10:10:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar1.png',
    name: 'Alice Johnson',
    participantId: 'P001',
    score: [8, 2001],
    collectionName: 'micah',
  },
  {
    answers: [
      { slideNumber: 1, answer: ['Maybe'], time: '2024-11-18T10:06:00Z' },
      { slideNumber: 2, answer: ['Yes'], time: '2024-11-18T10:11:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar2.png',
    name: 'Bob Smith',
    participantId: 'P002',
    score: [10, 1980],
    collectionName: 'micah',
  },
  {
    answers: [{ slideNumber: 1, answer: ['No'], time: '2024-11-18T10:07:00Z' }],
    hasAnswered: true,
    avatar: 'https://example.com/avatar3.png',
    name: 'Charlie Brown',
    participantId: 'P003',
    score: [5, 1460],
    collectionName: 'micah',
  },
  {
    answers: [],
    hasAnswered: false,
    avatar: 'https://example.com/avatar4.png',
    name: 'Diana Prince',
    participantId: 'P004',
    score: [1001, 3089],
    collectionName: 'micah',
  },
  {
    answers: [
      { slideNumber: 1, answer: ['Agree'], time: '2024-11-18T10:08:00Z' },
      { slideNumber: 3, answer: ['Disagree'], time: '2024-11-18T10:15:00Z' },
    ],
    hasAnswered: true,
    avatar: 'https://example.com/avatar5.png',
    name: 'Ethan Hunt',
    participantId: 'P005',
    score: [1000, 3423],
    collectionName: 'micah',
  },
];

export function Preview({
  slide,
  onSlideUpdate,
}: {
  slide: ScoreSlide;
  onSlideUpdate: (slide: ScoreSlide) => void;
}) {
  const handleTitleChange = (newTitle: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, title: newTitle });
    }
  };
  return (
    <div className="space-y-12 w-full p-15 mt-20">
      <SlideTitle
        title={slide.title}
        isEditable
        onTitleChange={handleTitleChange}
      />
      <ScoreBoard
        slides={[slide] as Slide[]}
        currentSlide={0}
        participants={mockParticipants}
      />
    </div>
  );
}
