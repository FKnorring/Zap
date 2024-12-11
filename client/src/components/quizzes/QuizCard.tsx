import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Quiz from '@/models/Quiz';
import { SlidePreview } from '../quiz-editor/SlidePreview';
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
import { Share, Trash, Zap, MoreHorizontal, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppContext } from '@/contexts/App/context';
import ReactNiceAvatar, { genConfig } from 'react-nice-avatar';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

interface QuizCardProps {
  quiz: Quiz;
  onClick?: () => void;
  children?: ReactNode;
  variant?: 'my-quizzes' | 'shared-quizzes';
}

export function QuizCard({ quiz, onClick, children, variant }: QuizCardProps) {
  const {
    users: { resources: users },
  } = useAppContext();
  const quizHost = users.find((user) => user.id === quiz.user_id);

  return (
    <Card className={`${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg mr-auto">{quiz.quiz_name}</CardTitle>
          {quiz.isShared && (
            <div className="bg-primary text-white p-1 rounded flex flex-row">
              <Share className="w-4 h-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {quiz.slides && quiz.slides.length > 0 ? (
          <div className="aspect-video w-full rounded overflow text-white relative">
            <SlidePreview slide={quiz.slides[0]} {...quiz.settings} />
            {variant === 'shared-quizzes' && quizHost && (
              <div className="absolute bottom-[-10px] left-[-10px] z-50 bg-primary p-1 px-2 rounded text-white flex flex-row items-center gap-2">
                <span className="text-sm font-bold">By:</span>
                <ReactNiceAvatar
                  style={{
                    width: '28px',
                    height: '28px',
                  }}
                  {...genConfig(quizHost.avatar)}
                />
                <span className="text-sm rounded p-1 bg-primary-foreground">
                  {quizHost.username}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video w-full">
            <div className="h-full w-full bg-gray-200 animate-pulse rounded flex items-center justify-center">
              <span>{t('homepage:noSlides')}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2 flex-wrap">{children}</CardFooter>
    </Card>
  );
}

interface MyQuizButtonsProps {
  quiz: Quiz;
  onHost: (quiz: Quiz) => Promise<void>;
  onShare: (quizId: string) => Promise<void>;
  onDelete: (quizId: string) => Promise<void>;
}

export function MyQuizButtons({
  quiz,
  onHost,
  onShare,
  onDelete,
}: MyQuizButtonsProps) {
  const { t } = useTranslation();
  const { ongoingQuizzes: { resources, isLoading } } = useAppContext();
  const noSlides = !quiz.slides || quiz.slides.length === 0;

  const existingOngoingQuiz = resources.length !== 0;

  const isDisabled = noSlides || isLoading || existingOngoingQuiz;

  return (
    <>
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
              onShare(quiz.id);
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
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Dialog>
              <DialogTrigger className="flex w-full items-center gap-2">
                <Trash className="w-4 h-4" />
                {t('general:delete')}
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>{t('homepage:deleteQuiz')}</DialogTitle>
                  <DialogDescription>
                    {t('homepage:deleteQuizDescription')} "{quiz.quiz_name}"?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="flex justify-end gap-2 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">{t('general:cancel')}</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(quiz.id);
                        }}
                      >
                        {t('general:delete')}
                      </Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

interface SharedQuizButtonsProps {
  quiz: Quiz;
  onCopyToMyQuizzes: (quiz: Quiz) => Promise<void>;
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
            {t('homepage:copy')} "{quiz.quiz_name}"
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
