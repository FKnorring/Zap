import { Participant } from '@/models/Quiz';
import RenderCorrectIncorrect from '../base/RenderCorrectIncorrect';

export function ParticipantAnswer({
  participant,
}: {
  participant: Participant;
}) {
  return <RenderCorrectIncorrect participant={participant} />;
} 