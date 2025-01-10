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
    <div className="bg-[#F8F8F8] h-screen">
      <ToolsProvider>
        <h1 className="text-black text-center text-4xl font-display mb-8 mt-10">
          {t('general:tools')}
        </h1>
        <div className="flex flex-col items-center mx-4 ">
          <Tabs value={tool} onValueChange={handleTabChange}>
            {/* Tab Triggers */}
            <TabsList className="mb-4">
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
          </Tabs>

          {/* Tab Content */}
          <div className=" bg-slate-400 w-full max-w-4xl p-4 rounded-lg  shadow-md">
            <Tabs value={tool} onValueChange={handleTabChange}>
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
        </div>
      </ToolsProvider>
    </div>
  );
}
