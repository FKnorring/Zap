import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Quiz, Participant } from '@/models/Quiz';
import Results from './Results';
import { useTranslation } from 'react-i18next';
import Stats from './Stats';
import { useState } from 'react';
import { flags } from '@/config'

interface EndScreenProps {
  quiz: Quiz;
  endQuiz: () => void;
  participants: Participant[];
}

export default function EndScreen({ endQuiz, participants }: EndScreenProps) {
  const { t } = useTranslation(['slides']);
  const [fixedParticipants] = useState(participants);
  return (
    <div className="flex-1 flex flex-col p-20 gap-6">
      <div className="flex-1 flex flex-col items-center mt-4">
        {flags.ENABLE_STATISTICS ? (
          <Tabs
            className="flex-1 flex flex-col w-full gap-4"
            defaultValue="results"
          >
            <TabsList className="font-display bg-transparent">
              <TabsTrigger className="text-6xl" value="results">
                {t('results')}
              </TabsTrigger>
              <TabsTrigger className="text-6xl" value="statistics">
                {t('statistics')}
              </TabsTrigger>
            </TabsList>
            <TabsContent className="flex-1 overflow-hidden" value="results">
              <Results participants={fixedParticipants} />
            </TabsContent>
            <TabsContent className="flex-1" value="statistics">
              <Stats participants={fixedParticipants} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 overflow-hidden">
            <Results participants={fixedParticipants} />
          </div>
        )}
      </div>
      <div className="absolute bottom-8 right-10">
        <Button className="max-w-sm " onClick={endQuiz}>
          {t('endQuiz')}
        </Button>
      </div>
    </div>
  );
}
