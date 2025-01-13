import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Team from './Team';
import SpinWheel from './SpinWheel';
import RandomNumber from './RandomNumber';
import { ToolsProvider } from '@/contexts/Tools/context';
import { cn } from '@/lib/utils';

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

  // Logic for dynamic classes for active/inactive tabs
  const getTabClass = (tabValue: string) => {
    return tabValue === tool
      ? 'font-display bg-white text-black shadow-sm' // Active state styles
      : 'font-display text-black'; // Inactive state styles
  };

  return (
    <div className="bg-[#F8F8F8] h-screen overflow-y-auto">
      <div className="mb-10">
        <ToolsProvider>
          <h1 className="text-black text-center text-4xl font-display mb-8 mt-10">
            {t('general:tools')}
          </h1>
          <div className="flex flex-col mx-4 justify-center items-center">
            <Tabs
              value={tool}
              onValueChange={handleTabChange}
              className="w-full flex flex-col justify-center items-center"
            >
              <TabsList className="flex justify-center bg-slate-400 k mb-4 p-8 rounded-md">
                <TabsTrigger
                  value="team-generator"
                  className={cn(
                    'text-2xl px-6 py-2 rounded-lg',
                    getTabClass('team-generator') // Apply dynamic class
                  )}
                >
                  {t('general:teamGenerator')}
                </TabsTrigger>
                <TabsTrigger
                  value="spin-wheel"
                  className={cn(
                    'text-2xl px-6 py-2 rounded-lg',
                    getTabClass('spin-wheel') // Apply dynamic class
                  )}
                >
                  {t('general:spinWheel')}
                </TabsTrigger>
                <TabsTrigger
                  value="random-number"
                  className={cn(
                    'text-2xl px-6 py-2 rounded-lg',
                    getTabClass('random-number') // Apply dynamic class
                  )}
                >
                  {t('general:randomNumber')}
                </TabsTrigger>
              </TabsList>

              <div className="bg-slate-400 w-full max-w-4xl p-4 rounded-lg shadow-md relative">
                <TabsContent value="team-generator">
                  <Team />
                </TabsContent>

                <TabsContent value="spin-wheel">
                  <SpinWheel />
                </TabsContent>

                <TabsContent value="random-number">
                  <RandomNumber />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </ToolsProvider>
      </div>
    </div>
  );
}
