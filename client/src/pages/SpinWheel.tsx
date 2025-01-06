import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { DynamicInputList, InputItem } from '@/components/ui/dynamic-input-list';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTools } from '@/contexts/Tools/context';

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B59B6',
  '#3498DB',
  '#E67E22',
  '#2ECC71',
];

interface WheelItem extends InputItem {
  percentage: number;
  color: string;
  used?: boolean;
}

export default function SpinWheel() {
  const { t } = useTranslation();
  const { showAdvanced, setShowAdvanced, currentItems, setCurrentItems } = useTools();
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(() => {
    if (currentItems.length > 0) {
      return currentItems.map((item, index) => ({
        ...item,
        percentage: item.text ? 100 / currentItems.filter(i => i.text !== '').length : 0,
        color: COLORS[index % COLORS.length],
        used: false
      }));
    }
    return [{ id: '1', text: '', percentage: 100, color: COLORS[0], used: false }];
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<WheelItem | null>(null);

  // Add effect to watch for changes in currentItems
  useEffect(() => {
    const newWheelItems = currentItems.map((item, index) => ({
      ...item,
      percentage: item.text ? 100 / currentItems.filter(i => i.text !== '').length : 0,
      color: COLORS[index % COLORS.length],
      used: false
    }));
    setWheelItems(newWheelItems);
    if (currentItems.length === 1 && currentItems[0].text === '') {
      setWinner(null);
    }
  }, [currentItems]);

  const normalizePercentages = (items: WheelItem[]): WheelItem[] => {
    const validItems = items.filter(item => item.text !== '' && !item.used);
    if (validItems.length === 0) return items;

    const total = validItems.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(total - 100) < 0.01) return items;

    return items.map(item => {
      if (item.text !== '' && !item.used) {
        return {
          ...item,
          percentage: (item.percentage / total) * 100
        };
      }
      return item;
    });
  };

  const handleInputChange = (id: string, value: string) => {
    const newItems = wheelItems.map(item =>
      item.id === id ? { ...item, text: value } : item
    );

    if (newItems[newItems.length - 1]?.text !== '') {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        percentage: 0,
        color: COLORS[newItems.length % COLORS.length],
      });
    }

    const itemsWithContent = newItems.filter(item => item.text !== '');
    const defaultPercentage = 100 / itemsWithContent.length;
    newItems.forEach(item => {
      if (item.text !== '') {
        item.percentage = defaultPercentage;
      }
    });

    const normalizedItems = normalizePercentages(newItems);
    setWheelItems(normalizedItems);
    setCurrentItems(normalizedItems);
  };  

  const handleQuickAdd = (values: string[]) => {
    const newItems = values.map((text, index) => ({
      id: Date.now() + index.toString(),
      text,
      percentage: 100 / values.length,
      color: COLORS[index % COLORS.length],
      used: false
    }));

    newItems.push({
      id: Date.now() + values.length.toString(),
      text: '',
      percentage: 0,
      color: COLORS[values.length % COLORS.length],
      used: false
    });

    const normalizedItems = normalizePercentages(newItems);
    setWheelItems(normalizedItems);
    setCurrentItems(normalizedItems);
  };

  const handlePercentageChange = (id: string, value: string) => {
    const newPercentage = parseFloat(value) || 0;
    if (newPercentage < 0 || newPercentage > 100) return;

    const validItems = wheelItems.filter(item => item.text !== '');
    if (validItems.length <= 1) return;

    const changedItem = validItems.find(item => item.id === id);
    if (!changedItem) return;

    const oldPercentage = changedItem.percentage;
    const percentageDiff = newPercentage - oldPercentage;
    
    // If trying to set a percentage that would make others negative, adjust it
    const otherItemsTotal = validItems.reduce((sum, item) => 
      item.id !== id ? sum + item.percentage : sum, 0
    );
    
    if (newPercentage > 100 || otherItemsTotal - Math.abs(percentageDiff) < 0) {
      return;
    }

    // Calculate how much each other item should be adjusted
    const adjustmentRatio = Math.abs(percentageDiff) / otherItemsTotal;

    const newItems = wheelItems.map(item => {
      if (item.id === id) {
        return { ...item, percentage: newPercentage };
      } else if (item.text !== '') {
        const adjustment = item.percentage * adjustmentRatio;
        return {
          ...item,
          percentage: percentageDiff > 0
            ? item.percentage - adjustment
            : item.percentage + (adjustment * (otherItemsTotal / (100 - newPercentage)))
        };
      }
      return item;
    });

    setWheelItems(normalizePercentages(newItems));
  };

  const removeItem = (id: string) => {
    if (wheelItems.length <= 1) return;
    
    const newItems = wheelItems.filter(item => item.id !== id);
    if (newItems.every(item => item.text !== '')) {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        percentage: 0,
        color: COLORS[newItems.length % COLORS.length],
      });
    }

    const itemsWithContent = newItems.filter(item => item.text !== '');
    const defaultPercentage = 100 / itemsWithContent.length;
    newItems.forEach(item => {
      if (item.text !== '') {
        item.percentage = defaultPercentage;
      }
    });

    const normalizedItems = normalizePercentages(newItems);
    setWheelItems(normalizedItems);
    setCurrentItems(normalizedItems);
  };

  const clearItems = () => {
    const newItems = [{ id: Date.now().toString(), text: '', percentage: 100, color: COLORS[0] }];
    setWheelItems(newItems);
    setCurrentItems(newItems);
    setWinner(null);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setWinner(null);
    setIsSpinning(true);
    const spinDuration = 3000; // 3 seconds
    const extraSpins = 5; // Number of full rotations
    const randomAngle = Math.random() * 360; // Random final position
    const totalRotation = 360 * extraSpins + randomAngle;

    setRotation(rotation + totalRotation);

    // Calculate winner after spin
    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = (rotation + totalRotation) % 360;
      const winningItem = getWinningItem(finalAngle);
      if (winningItem) {
        setWinner(winningItem);
      }
    }, spinDuration);
  };

  const getWinningItem = (finalAngle: number): WheelItem | null => {
    const normalizedAngle = (360 - (finalAngle % 360) + 90) % 360;
    let currentAngle = 0;
    
    const validItems = wheelItems.filter(item => item.text !== '' && !item.used);
    
    for (const item of validItems) {
      currentAngle += item.percentage * 3.6; // Convert percentage to degrees
      if (normalizedAngle <= currentAngle) {
        return item;
      }
    }
    
    return validItems[0] || null;
  };

  const calculateRotation = (index: number): number => {
    const validItems = wheelItems.filter(item => item.text !== '');
    let totalPercentage = 0;
    for (let i = 0; i < index; i++) {
      totalPercentage += validItems[i].percentage;
    }
    return (totalPercentage / 100) * 360;
  };

  const markWinnerAsUsed = () => {
    if (!winner) return;
    
    const newItems = wheelItems.map(item => 
      item.id === winner.id 
        ? { ...item, used: true, percentage: 0 }
        : item
    );

    // Recalculate percentages for remaining items
    const remainingItems = newItems.filter(item => item.text !== '' && !item.used);
    const newPercentage = 100 / remainingItems.length;
    
    const normalizedItems = newItems.map(item => 
      item.text !== '' && !item.used
        ? { ...item, percentage: newPercentage }
        : item
    );

    setWheelItems(normalizePercentages(normalizedItems));
    setWinner(null);
    setRotation(0);
  };

  const resetUsedItems = () => {
    const newItems = wheelItems.map(item => ({ ...item, used: false }));
    const validItems = newItems.filter(item => item.text !== '');
    const newPercentage = 100 / validItems.length;
    
    const normalizedItems = newItems.map(item => 
      item.text !== ''
        ? { ...item, percentage: newPercentage }
        : item
    );

    setWheelItems(normalizePercentages(normalizedItems));
    setWinner(null);
    setRotation(0);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">{t('general:spinWheel.items')}</Label>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearItems}
                          className="mr-2"
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
                  <Switch
                    id="advanced"
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                  />
                  <Label htmlFor="advanced">
                    {t('general:spinWheel.advancedSettings')}
                  </Label>
                </div>
              </div>

              <DynamicInputList
                items={wheelItems}
                showAdvanced={showAdvanced}
                showColors={true}
                onItemChange={handleInputChange}
                onItemRemove={removeItem}
                onPercentageChange={handlePercentageChange}
                inputPlaceholder={t('general:spinWheel.title')}
                quickAddPlaceholder="Item1, Item2, Item3..."
                onQuickAdd={handleQuickAdd}
                listLabel={t('general:spinWheel.items')}
                quickAddLabel={t('general:spinWheel.quickAdd')}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-square">
            <motion.div
              className="w-full h-full"
              animate={{ rotate: rotation }}
              transition={{
                duration: 3,
                ease: 'easeOut',
              }}
              style={{
                transformOrigin: 'center center',
                position: 'relative',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {wheelItems
                  .filter(item => item.text !== '' && !item.used)
                  .map((item, index) => {
                    const startAngle = calculateRotation(index);
                    const endAngle = startAngle + (item.percentage / 100) * 360;
                    const largeArcFlag = item.percentage > 50 ? 1 : 0;

                    // Calculate coordinates for the slice
                    const startX = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
                    const startY = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
                    const endX = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
                    const endY = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));

                    // Calculate text position - adjusted for better centering
                    const midAngle = startAngle + (item.percentage / 200) * 360;
                    const textRadius = Math.min(35, 35 * (item.percentage / 50)); // Adjust radius based on segment size
                    const textX = 50 + textRadius * Math.cos((midAngle - 90) * (Math.PI / 180));
                    const textY = 50 + textRadius * Math.sin((midAngle - 90) * (Math.PI / 180));

                    const pathData = `
                      M 50 50
                      L ${startX} ${startY}
                      A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}
                      Z
                    `;

                    return (
                      <g key={item.id}>
                        <path
                          d={pathData}
                          fill={item.color}
                          stroke="white"
                          strokeWidth="0.5"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="white"
                          fontSize={Math.min(4, 4 * (item.percentage / 25))} // Adjust font size based on segment size
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                          style={{ userSelect: 'none' }}
                        >
                          {item.text}
                        </text>
                      </g>
                    );
                  })}
                {wheelItems.filter(item => item.text !== '' && !item.used).length === 0 && (
                  <circle cx="50" cy="50" r="50" fill="#ccc" />
                )}
              </svg>
            </motion.div>

            {/* Pointer */}
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-8 h-8 bg-white shadow-lg"
                style={{
                  clipPath: 'polygon(100% 0, 100% 100%, 0 50%)'
                }}
              />
            </div>

            <Button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12 p-0"
              onClick={spinWheel}
              disabled={wheelItems.filter(item => item.text !== '').length < 2}
            >
              {t('general:spinWheel.spin')}
            </Button>

            <AnimatePresence>
              {winner && !isSpinning && (
                <motion.div
                  initial={{ scale: 0, y: 50, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0, y: 50, opacity: 0 }}
                  className="absolute top-full left-1/3 transform mt-6 bg-primary text-white px-6 py-3 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">{winner.text}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={markWinnerAsUsed}
                    >
                      {t('general:spinWheel.markAsUsed')}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Used items section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">{t('general:spinWheel.usedItems')}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetUsedItems}
                  disabled={!wheelItems.some(item => item.used)}
                >
                  {t('general:spinWheel.resetUsed')}
                </Button>
              </div>
              <div className="space-y-2">
                {wheelItems
                  .filter(item => item.used)
                  .map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 rounded-md bg-muted"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.text}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 