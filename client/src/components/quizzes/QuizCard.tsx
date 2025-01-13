import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { InfoSlide, UserQuizzes } from '@/models/Quiz';
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
import { Share, Trash, Zap, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppContext } from '@/contexts/App/context';
import { useTranslation } from 'react-i18next';
import { SlidePreview } from '../quiz-editor/SlidePreview';

interface QuizCardProps {
  quiz: UserQuizzes;
  onClick?: () => void;
  children?: ReactNode;
}

export function QuizCard({ quiz, onClick, children }: QuizCardProps) {
  const mockInfo = {
    title: quiz.quizName,
    description: '',
    type: 'info',
    id: '1',
  };
  return (
    <Card
      className={`${onClick ? 'cursor-pointer' : ''} bg-[#FFFFFF]` }
      onClick={onClick}
    >
      <div className="flex items-center gap-2 ml-6">
        <CardTitle className="text-lg mr-auto pb-1 pt-4 font-display">
          {quiz.quizName}
        </CardTitle>
        {quiz.isShared && (
          <div className="bg-primary text-white p-1 rounded flex flex-row">
            <Share className="w-4 h-4" />
          </div>
        )}
      </div>

      <CardContent>
        <div className="aspect-video w-full rounded overflow text-white relative">
          <SlidePreview slide={mockInfo as InfoSlide} />
        </div>
      </CardContent>
      <CardFooter className="gap-2 flex-wrap">{children}</CardFooter>
    </Card>
  );
}

interface MyQuizButtonsProps {
  quiz: UserQuizzes;
  onHost: (quiz: UserQuizzes) => Promise<void>;
  onShare: (quizId: string, quizName: string) => Promise<void>;
  onDelete: (quizId: string) => Promise<void>;
}

export function MyQuizButtons({
  quiz,
  onHost,
  onShare,
  onDelete,
}: MyQuizButtonsProps) {
  const { t } = useTranslation();
  const {
    ongoingQuizzes: { resources, isLoading },
  } = useAppContext();
  const noSlides = false;

  const existingOngoingQuiz = resources.length !== 0;

  const isDisabled = noSlides || isLoading || existingOngoingQuiz;

  const setBodyPointerEvents = (value: boolean) => {
    document.body.style.pointerEvents = value ? 'auto' : 'none';
  };

  return (
    <>
      <Dialog onOpenChange={(open) => setBodyPointerEvents(open)}>
        <Button
          size="sm"
          disabled={isDisabled}
          variant={isDisabled ? 'outline' : 'default'}
          onClick={(e) => {
            e.stopPropagation();
            if (noSlides) return;
            onHost(quiz);
          }}
          className="gap-1 mr-auto flex items-center"
        >
          <span className="leading-none">{t('homepage:startQuiz')}</span>
          <Zap className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" className="aspect-square">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onShare(quiz.quizId, quiz.quizName);
              }}
            >
              <Share className="w-4 h-4 cursor-pointer" />
              <span className="cursor-pointer">{t('general:share')}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <DialogTrigger className="flex w-full items-center gap-2">
                <Trash className="w-4 h-4" />
                {t('general:delete')}
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>{t('homepage:deleteQuiz')}</DialogTitle>
            <DialogDescription>
              {t('homepage:deleteQuizDescription')} "{quiz.quizName}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button className='text-black' variant="outline">{t('general:cancel')}</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(quiz.quizId);
                  }}
                >
                  {t('general:delete')}
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
