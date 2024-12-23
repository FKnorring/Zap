import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { InfoSlide, SharedQuizzes } from '@/models/Quiz';
import { SlidePreview } from '../quiz-editor/SlidePreview';
import Avatar from '@/Avatar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';
import { Copy } from 'lucide-react';

import { t } from 'i18next';

interface SharedQuizCardProps {
  quiz: SharedQuizzes;
  onClick?: () => void;
  children?: ReactNode;
}

export function SharedQuizCard({
  quiz,
  onClick,
  children,
}: SharedQuizCardProps) {
  const mockInfo = {
    title: quiz.quizName,
    description: '',
    type: 'info',
    id: '1',
  };

  return (
    <Card className={`${onClick ? 'cursor-pointer' : ''} bg-gray-300`} onClick={onClick}>
      <CardContent>
        <CardTitle className="text-lg mr-auto pb-1 pt-5">
          {quiz.quizName}
        </CardTitle>
        <div className="aspect-video w-full rounded overflow text-white relative">
          <SlidePreview slide={mockInfo as InfoSlide} />
          <div className="font-display absolute bottom-[-10px] left-[-10px] z-50 bg-primary p-1 px-2 rounded text-black flex flex-row items-center gap-1 border">
            <span className="text-lg ">By:</span>
            <Avatar
              width='1.5625rem'
              height='1.5625rem'
              avatarString={quiz.userAvatar}
              collectionName={quiz.collectionName}
            ></Avatar>
            <span className="text-sm">{quiz.userName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 flex-wrap">{children}</CardFooter>
    </Card>
  );
}

interface SharedQuizButtonsProps {
  quiz: SharedQuizzes;
  onCopyToMyQuizzes: (quiz: SharedQuizzes) => Promise<void>;
}

export function SharedQuizButtons({
  quiz,
  onCopyToMyQuizzes,
}: SharedQuizButtonsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {t('homepage:copy')}
          <Copy className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {t('homepage:copy')} "{quiz.quizName}"
          </DialogTitle>
          <DialogDescription>{t('homepage:copyDescription')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">{t('general:cancel')}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyToMyQuizzes(quiz);
                }}
              >
                {t('homepage:copy')}
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
