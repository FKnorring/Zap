import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Team from './Team';
import SpinWheel from './SpinWheel';
import RandomNumber from './RandomNumber';
import { ToolsProvider } from '@/contexts/Tools/context';

export default function Tools() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tool } = useParams();

  useEffect(() => {
    if (!tool) {
      navigate('/tools/team-generator');
    }
  }, [tool, navigate]);

  const handleTabChange = (value: string) => {
    navigate(`/tools/${value}`);
  };

  return (
    <ToolsProvider>
      <div className="container mx-auto p-4 flex-1 overflow-y-auto">
        <h1 className="text-4xl font-display mb-8">{t('general:tools')}</h1>
        <Tabs value={tool} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="team-generator">
              {t('general:teamGenerator')}
            </TabsTrigger>
            <TabsTrigger value="spin-wheel">
              {t('general:spinWheel')}
            </TabsTrigger>
            <TabsTrigger value="random-number">
              {t('general:randomNumber')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="team-generator">
            <Team />
          </TabsContent>
          <TabsContent value="spin-wheel">
            <SpinWheel />
          </TabsContent>
          <TabsContent value="random-number">
            <RandomNumber />
          </TabsContent>
        </Tabs>
      </div>
    </ToolsProvider>
  );
} 