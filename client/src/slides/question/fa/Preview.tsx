import { Button } from '@/components/ui/button';
import { FASlide } from '@/models/Quiz';
import { BaseQuestionRender } from '@/slides/question/base/QuestionRender';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Avatar from '@/Avatar';

export function Preview({ slide }: { slide: FASlide }) {
  const { t } = useTranslation(['questions']);
  var participants = [
    {
      name: 'Alice Johnson',
      participantId: 'P001',
      avatar: 'EROHNv5Xbi',
      hasAnswered: true,
      score: [0],
      answers: [
        {
          slideNumber: 1,
          answer: [''],
          time: '2024-11-26T14:45:00Z',
        },
      ],
      collectionName: 'micah',
    },
    {
      name: 'Bob Smith',
      participantId: 'P002',
      avatar: '1DlEEWtlZB',
      hasAnswered: false,
      score: [0],
      answers: [
        {
          slideNumber: 1,
          answer: [''],
          time: '2024-11-26T14:28:00Z',
        },
      ],
      collectionName: 'micah',
    },
    {
      name: 'Charlie Brown',
      participantId: 'P003',
      avatar: 'orXBJkBsVO',
      hasAnswered: true,
      score: [0],
      answers: [
        {
          slideNumber: 1,
          answer: [''],
          time: '2024-11-26T14:30:00Z',
        },
      ],
      collectionName: 'micah',
    },
  ];

  return (
    <div>
      <BaseQuestionRender slide={slide} />
      <div className="flex flex-col items-center m-16 gap-10">
        <h1 className="text-6xl font-display">{t('nextUp')}</h1>
        {participants.map((participant, index) => (
          <div
            key={index}
            className="flex flex-row justify-center items-center gap-16"
          >
            {index == 0 && (
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center p-0 [&_svg]:size-8"
                >
                  <X />
                </Button>
                <h1 className="text-1xl font-display">{t('wrongAnswer')}</h1>
              </div>
            )}
            <div className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out] ">
              <Avatar
                width={index === 0 ? '10rem' : index === 1 ? '5rem' : '4.5rem'}
                height={index === 0 ? '10rem' : index === 1 ? '5rem' : '4.5rem'}
                avatarString={participant.avatar}
                collectionName={participant.collectionName}
              />

              <span
                className={`${
                  index === 0
                    ? 'text-5xl font-bold'
                    : index === 1
                      ? 'text-2xl font-medium'
                      : 'text-xl font-normal'
                } font-display`}
              >
                {participant.name}
              </span>
            </div>
            {index == 0 && (
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center p-0 [&_svg]:size-8"
                >
                  <Check />
                </Button>
                <h1 className="text-1xl font-display">{t('rightAnswer')}</h1>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

//
