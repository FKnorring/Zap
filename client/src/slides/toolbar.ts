import {
  Slide,
  InfoSlide,
  MCQMASlide,
  MCQSASlide,
  RankSlide,
  QuestionSlide,
  FTASlide,
  MatchingSlide,
  BombSlide,
} from '@/models/Quiz';
import ImageInput from './_toolbar/inputs/ImageInput';
import BackgroundInput from './_toolbar/inputs/BackgroundInput';
import EmbedVideoInput from './_toolbar/inputs/EmbedVideoInput';
import { MCQOptionsInput } from './_toolbar/inputs/MCQOptionsInput';
import { RankOptionsInput } from './_toolbar/inputs/RankOptionsInput';
import { QuestionSettingsInput } from './_toolbar/inputs/QuestionSettingsInput';
import TitleInput from './_toolbar/inputs/TitleInput';
import ContentInput from './_toolbar/inputs/ContentInput';
import { AnswerText } from './_toolbar/inputs/AnswerInput';
import { SelectPoints } from './_toolbar/inputs/SelectPoints';
import { LocateItInputs } from './_toolbar/inputs/LocateItInputs';
import { MatchingOptionsInput } from './_toolbar/inputs/MatchingOptionsInput';
import { MCQSAPoints } from './_toolbar/inputs/MCQSAPoints';
import { BombOptionsInput } from './_toolbar/inputs/BombOptionsInput';
import { ImagePositionInput } from './_toolbar/inputs/ImagePositionInput';
import { BulletPointSlideInput } from './_toolbar/inputs/BulletPointSlideInput';
import { BulletPointStyleInput } from './_toolbar/inputs/BulletPointStyleInput';
import { JeopardyInput } from './_toolbar/inputs/JeopardyInput';
import { JeopardyScoreInput } from './_toolbar/inputs/JeopardyScoreInput';
import { JeopardyTimeLimits } from './_toolbar/inputs/JeopardyTimeLimits';
import { JeopardyAIInput } from './_toolbar/inputs/JeopardyAIInput';
import { ClosestInput } from "./_toolbar/inputs/ClosestInput";

export interface ToolbarProps<T extends Slide> {
  slide: T;
  onSlideUpdate: (slide: T) => void;
}

type BaseToolbarItem<T extends Slide> = {
  label: string;
  component: React.ComponentType<ToolbarProps<T>>;
};

type ToolbarConfig<T extends Slide = Slide> = (BaseToolbarItem<T> & {
  field: keyof T;
})[];

const baseToolbarConfig: ToolbarConfig = [
  {
    field: 'title',
    label: 'Title',
    component: TitleInput,
  },
  {
    field: 'content',
    label: 'Content',
    component: ContentInput,
  },
  {
    field: 'imageUrl',
    label: 'Image',
    component: ImageInput,
  },
  {
    field: 'backgroundStyle',
    label: 'Background',
    component: BackgroundInput,
  },
];

const baseQuestionToolbarConfig: ToolbarConfig<QuestionSlide> = [
  {
    field: 'showCorrectAnswer',
    label: 'Question Settings',
    component: QuestionSettingsInput,
  },
  {
    field: 'points',
    label: 'Select Points',
    component: SelectPoints,
  },
];

export const toolbarConfigs = {
  info: [
    ...baseToolbarConfig,
    {
      field: 'video' as keyof InfoSlide,
      label: 'Video',
      component: EmbedVideoInput,
    },
  ],

  score: [
    {
      field: 'title',
      label: 'Title',
      component: TitleInput,
    },
    {
      field: 'backgroundStyle',
      label: 'Background',
      component: BackgroundInput,
    },
  ],

  lobby: [],

  MCQMA: [
    ...baseToolbarConfig,
    ...baseQuestionToolbarConfig,
    {
      field: 'options' as keyof MCQMASlide,
      label: 'Options',
      component: MCQOptionsInput,
    },
  ],

  MCQSA: [
    ...baseToolbarConfig,
    ...baseQuestionToolbarConfig,
    {
      field: 'pointsAwarding' as keyof MCQSASlide,
      label: 'Points Awarding',
      component: MCQSAPoints,
    },
    {
      field: 'options' as keyof MCQSASlide,
      label: 'Options',
      component: MCQOptionsInput,
    },
  ],

  RANK: [
    ...baseToolbarConfig,
    ...baseQuestionToolbarConfig,
    {
      field: 'ranking' as keyof RankSlide,
      label: 'Ranking',
      component: RankOptionsInput,
    },
  ],

  FTA: [
    ...baseToolbarConfig,
    ...baseQuestionToolbarConfig,
    {
      field: 'correctAnswer' as keyof FTASlide,
      label: 'Correct Answer',
      component: AnswerText,
    },
  ],

  FA: [
    ...baseToolbarConfig,
    ...baseQuestionToolbarConfig,
    {
      field: 'correctAnswer' as keyof FTASlide,
      label: 'Correct Answer',
      component: AnswerText,
    },
  ],

  MATCHING: [
    ...baseToolbarConfig,
    {
      field: 'labels' as keyof MatchingSlide,
      label: 'Matching Items',
      component: MatchingOptionsInput,
    },
    ...baseQuestionToolbarConfig,
  ],

  LOCATEIT: [
    {
      field: 'title',
      label: 'Title',
      component: TitleInput,
    },

    {
      field: 'imageUrl',
      label: 'Image',
      component: ImageInput,
    },
    {
      field: 'backgroundStyle',
      label: 'Background',
      component: BackgroundInput,
    },
    ...baseQuestionToolbarConfig,
    {
      field: 'location' as keyof FTASlide,
      label: 'Location',
      component: LocateItInputs,
    },
  ],

  BOMB: [
    {
      field: 'title',
      label: 'Title',
      component: TitleInput,
    },
    {
      field: 'backgroundStyle',
      label: 'Background',
      component: BackgroundInput,
    },
    {
      field: 'labels' as keyof BombSlide,
      label: 'Bomb Question',
      component: BombOptionsInput,
    },
    ...baseQuestionToolbarConfig,
  ],

  bulletPoint: [
    {
      field: 'title',
      label: 'Title',
      component: TitleInput,
    },
    {
      field: 'points',
      label: 'Bullet Points',
      component: BulletPointSlideInput,
    },
    {
      field: 'fontSize',
      label: 'Bullet Point Style',
      component: BulletPointStyleInput,
    },
    {
      field: 'imageUrl',
      label: 'Image',
      component: ImageInput,
    },
    {
      field: 'imagePosition',
      label: 'Image Position',
      component: ImagePositionInput,
    },
    {
      field: 'backgroundStyle',
      label: 'Background',
      component: BackgroundInput,
    },
  ],

  JEOPARDY: [
    {
      field: 'categories',
      label: 'Categories',
      component: JeopardyInput,
    },
    {
      field: 'AIcategories',
      label: 'AI Category Generator',
      component: JeopardyAIInput,
    },
    {
      field: 'minScore',
      label: 'Scores',
      component: JeopardyScoreInput,
    },
    {
      field: 'mainTimeLimit',
      label: 'Time Limits',
      component: JeopardyTimeLimits,
    },
    {
      field: 'backgroundStyle',
      label: 'Background',
      component: BackgroundInput,
    },
  ],

  CLOSEST: [
    ...baseToolbarConfig,
    {
      field: 'correctAnswer',
      label: 'Correct Answer',
      component: ClosestInput,
    },
    ...baseQuestionToolbarConfig,
  ],
} as const;
