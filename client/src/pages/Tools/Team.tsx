import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Shuffle } from 'lucide-react';
import { DynamicInputList, InputItem } from '@/components/ui/dynamic-input-list';
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from 'framer-motion';
import { useTools } from '@/contexts/Tools/context';

interface TeamItem extends InputItem {
  team?: number;
}

export default function Team() {
  const { t } = useTranslation();
  const { currentItems, setCurrentItems } = useTools();
  const [items, setItems] = useState<TeamItem[]>(
    currentItems.length > 0 
      ? currentItems.map((item: InputItem) => ({ ...item, team: undefined }))
      : [{ id: '1', text: '', team: undefined }]
  );
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffledNames, setShuffledNames] = useState<string[]>([]);

  // Add effect to watch for changes in currentItems
  useEffect(() => {
    const newItems = currentItems.map((item: InputItem) => ({ ...item, team: undefined }));
    setItems(newItems);
    
    // Reset teams if items are cleared
    if (currentItems.length === 1 && currentItems[0].text === '') {
      setTeams([]);
      setShuffledNames([]);
    }
  }, [currentItems]);

  const generateTeams = (players: string[], teamCount: number) => {
    if (players.length < teamCount) return [];

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const generatedTeams: string[][] = Array.from(
      { length: teamCount },
      () => []
    );

    shuffledPlayers.forEach((player, index) => {
      generatedTeams[index % teamCount].push(player);
    });

    return generatedTeams;
  };

  // Update teams whenever items or numberOfTeams changes
  useEffect(() => {
    const validPlayers = items
      .filter(item => item.text !== '')
      .map(item => item.text);

    if (validPlayers.length >= 2) {
      const newTeams = generateTeams(validPlayers, numberOfTeams);
      setTeams(newTeams);
      setShuffledNames(validPlayers);
    } else {
      setTeams([]);
      setShuffledNames([]);
    }
  }, [items, numberOfTeams]);

  // Update max number of teams based on number of players
  useEffect(() => {
    const validItems = items.filter(item => item.text !== '');
    if (validItems.length < numberOfTeams) {
      setNumberOfTeams(Math.max(2, validItems.length));
    }
  }, [items]);

  const handleInputChange = (id: string, value: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, text: value } : item
    );

    if (newItems[newItems.length - 1]?.text !== '') {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        team: undefined
      });
    }

    const finalItems = newItems.map(item => ({
      ...item,
      team: item.text !== '' ? item.team : undefined
    }));

    setItems(finalItems);
    setCurrentItems(finalItems);
  };

  const handleQuickAdd = (values: string[]) => {
    const newItems = values.map((text, index) => ({
      id: Date.now() + index.toString(),
      text,
      team: undefined
    }));

    newItems.push({
      id: Date.now() + values.length.toString(),
      text: '',
      team: undefined
    });

    setItems(newItems);
    setCurrentItems(newItems);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    
    const newItems = items.filter(item => item.id !== id);
    if (newItems.every(item => item.text !== '')) {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        team: undefined
      });
    }

    setItems(newItems);
    setCurrentItems(newItems);
  };

  const clearItems = () => {
    const newItems = [{ id: Date.now().toString(), text: '', team: undefined }];
    setItems(newItems);
    setCurrentItems(newItems);
    setTeams([]);
    setShuffledNames([]);
  };

  const randomizeTeams = async () => {
    const validPlayers = items
      .filter(item => item.text !== '')
      .map(item => item.text);

    if (validPlayers.length >= 2) {
      setIsShuffling(true);
      setTeams([]);

      // Animate shuffling names for 1.5 seconds
      const shuffleInterval = setInterval(() => {
        const shuffled = [...validPlayers].sort(() => Math.random() - 0.5);
        setShuffledNames(shuffled);
      }, 100);

      // After animation, show final teams
      setTimeout(() => {
        clearInterval(shuffleInterval);
        const newTeams = generateTeams(validPlayers, numberOfTeams);
        setTeams(newTeams);
        setIsShuffling(false);
      }, 1500);
    }
  };

  const validItemsCount = items.filter(item => item.text !== '').length;
  const maxTeams = Math.max(2, validItemsCount);

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">{t('general:playerNames')}</Label>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearItems}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('general:clear')}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('general:tools.clearTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {teams.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={randomizeTeams}
                      disabled={isShuffling}
                    >
                      <Shuffle className={`w-4 h-4 mr-2 ${isShuffling ? 'animate-spin' : ''}`} />
                      {t('general:randomize')}
                    </Button>
                  )}
                </div>
              </div>

              <div className="my-6 space-y-4">
                <div className="flex justify-between items-center">
                  <Label>{t('general:numberOfTeams')}</Label>
                  <span className="font-bold">{numberOfTeams}</span>
                </div>
                <Slider
                  value={[numberOfTeams]}
                  onValueChange={(value) => setNumberOfTeams(value[0])}
                  min={2}
                  max={maxTeams}
                  step={1}
                  className="w-full"
                />
              </div>

              <DynamicInputList
                items={items}
                showAdvanced={false}
                showColors={false}
                onItemChange={handleInputChange}
                onItemRemove={removeItem}
                inputPlaceholder={t('general:teamTitle')}
                quickAddPlaceholder="Player1, Player2, Player3..."
                onQuickAdd={handleQuickAdd}
                listLabel={t('general:playerNames')}
                quickAddLabel={t('general:spinWheel.quickAdd')}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {isShuffling ? (
              <motion.div
                key="shuffling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4"
              >
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-4">
                      {t('general:randomizing')}...
                    </h3>
                    <motion.ul 
                      className="space-y-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {shuffledNames.map((name, index) => (
                        <motion.li
                          key={index}
                          className="text-xl"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ 
                            x: 0, 
                            opacity: 1,
                            transition: { delay: index * 0.05 }
                          }}
                        >
                          {name}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                </Card>
              </motion.div>
            ) : teams.length > 0 && (
              <motion.div
                key="teams"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid gap-4"
              >
                {teams.map((team, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold mb-2">
                        {t('general:team')} {index + 1}
                      </h3>
                      <ul 
                        className="grid grid-cols-3 gap-x-4 gap-y-1 auto-rows-min grid-flow-col"
                        style={{
                          gridTemplateRows: 'repeat(2, minmax(0, auto))',
                          gridAutoFlow: team.length > 6 ? 'row' : 'column'
                        }}
                      >
                        {team.map((player, playerIndex) => (
                          <motion.li
                            key={playerIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: playerIndex * 0.1 }}
                            className="text-2xl font-bold truncate"
                          >
                            {player}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
