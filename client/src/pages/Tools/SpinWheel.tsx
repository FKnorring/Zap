import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  DynamicInputList,
  InputItem,
} from '@/components/ui/dynamic-input-list';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

const tempUsers: WheelItem[] = ['Bob', 'Samantha', 'Chris', 'Chloe'].map(
  (name, index) => ({
    id: Date.now().toString() + index, // Ensure unique ID
    text: name,
    percentage: 100 / 4, // Equal distribution for 4 users
    color: COLORS[index % COLORS.length], // Cycle through the color palette
    used: false,
  })
);
export default function SpinWheel() {
  const { t } = useTranslation();
  const { showAdvanced, setShowAdvanced, currentItems, setCurrentItems } =
    useTools();
  const [wheelItems, setWheelItems] = useState<WheelItem[]>([]); // Default to an empty array

  // Set the wheelItems whenever currentItems changes
  useEffect(() => {
    if (currentItems.length > 1) {
      setWheelItems(
        currentItems.map((item, index) => ({
          ...item,
          percentage: item.text
            ? 100 / currentItems.filter((i) => i.text !== '').length
            : 0,
          color: COLORS[index % COLORS.length],
          used: false,
        }))
      );
    } else {
      setWheelItems(tempUsers); // Fallback to tempUsers when no currentItems
    }
  }, [currentItems]); // Trigger when currentItems change

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [idleRotation, setIdleRotation] = useState(0); // Idle rotation angle
  const [previousIdleRotation, setPreviousIdleRotation] = useState(0);

  // Add effect to watch for changes in currentItems

  useEffect(() => {
    let idleInterval: NodeJS.Timeout;

    // Start idle rotation only if not spinning and modal is not shown
    if (!isSpinning && !showModal) {
      idleInterval = setInterval(() => {
        setIdleRotation((prev) => (prev + 0.2) % 360); // Increment rotation
      }, 50); // Adjust interval for speed
    }

    // Clear the interval when spinning starts or modal opens
    return () => {
      clearInterval(idleInterval);
    };
  }, [isSpinning, showModal]); // Dependency on isSpinning and showModal

  const normalizePercentages = (items: WheelItem[]): WheelItem[] => {
    const validItems = items.filter((item) => item.text !== '' && !item.used);
    if (validItems.length === 0) return items;

    const total = validItems.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(total - 100) < 0.01) return items;

    return items.map((item) => {
      if (item.text !== '' && !item.used) {
        return {
          ...item,
          percentage: (item.percentage / total) * 100,
        };
      }
      return item;
    });
  };

  const handleInputChange = (id: string, value: string) => {
    const newItems = wheelItems.map((item) =>
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

    const itemsWithContent = newItems.filter((item) => item.text !== '');
    const defaultPercentage = 100 / itemsWithContent.length;
    newItems.forEach((item) => {
      if (item.text !== '') {
        item.percentage = defaultPercentage;
      }
    });

    setWheelItems(newItems);
    setCurrentItems(newItems);
  };
  const handleQuickAdd = (values: string[]) => {
    const newItems = values.map((text, index) => ({
      id: Date.now() + index.toString(),
      text,
      percentage: 100 / values.length,
      color: COLORS[index % COLORS.length],
      used: false,
    }));

    newItems.push({
      id: Date.now() + values.length.toString(),
      text: '',
      percentage: 0,
      color: COLORS[values.length % COLORS.length],
      used: false,
    });

    const normalizedItems = normalizePercentages(newItems);
    setWheelItems(normalizedItems);
    setCurrentItems(normalizedItems);
  };

  const handlePercentageChange = (id: string, value: string) => {
    const newPercentage = parseFloat(value) || 0;
    if (newPercentage < 0 || newPercentage > 100) return;

    const validItems = wheelItems.filter((item) => item.text !== '');
    if (validItems.length <= 1) return;

    const changedItem = validItems.find((item) => item.id === id);
    if (!changedItem) return;

    const oldPercentage = changedItem.percentage;
    const percentageDiff = newPercentage - oldPercentage;

    // If trying to set a percentage that would make others negative, adjust it
    const otherItemsTotal = validItems.reduce(
      (sum, item) => (item.id !== id ? sum + item.percentage : sum),
      0
    );

    if (newPercentage > 100 || otherItemsTotal - Math.abs(percentageDiff) < 0) {
      return;
    }

    // Calculate how much each other item should be adjusted
    const adjustmentRatio = Math.abs(percentageDiff) / otherItemsTotal;

    const newItems = wheelItems.map((item) => {
      if (item.id === id) {
        return { ...item, percentage: newPercentage };
      } else if (item.text !== '') {
        const adjustment = item.percentage * adjustmentRatio;
        return {
          ...item,
          percentage:
            percentageDiff > 0
              ? item.percentage - adjustment
              : item.percentage +
                adjustment * (otherItemsTotal / (100 - newPercentage)),
        };
      }
      return item;
    });

    setWheelItems(normalizePercentages(newItems));
  };

  const removeItem = (id: string) => {
    if (wheelItems.length <= 1) return;

    const newItems = wheelItems.filter((item) => item.id !== id);
    if (newItems.every((item) => item.text !== '')) {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        percentage: 0,
        color: COLORS[newItems.length % COLORS.length],
      });
    }

    const itemsWithContent = newItems.filter((item) => item.text !== '');
    const defaultPercentage = 100 / itemsWithContent.length;
    newItems.forEach((item) => {
      if (item.text !== '') {
        item.percentage = defaultPercentage;
      }
    });

    const normalizedItems = normalizePercentages(newItems);
    setWheelItems(normalizedItems);
    setCurrentItems(normalizedItems);
  };

  const clearItems = () => {
    const newItems = [
      {
        id: Date.now().toString(),
        text: '',
        percentage: 100,
        color: COLORS[0],
      },
    ];
    setWheelItems(newItems);
    setCurrentItems(newItems);
    setWinner(null);
  };

  useEffect(() => {
    let idleInterval: NodeJS.Timeout;

    if (!isSpinning) {
      // Start idle rotation when not spinning
      idleInterval = setInterval(() => {
        setIdleRotation((prev) => (prev + 0.2) % 360); // Increment by 0.2 degrees per interval
      }, 50); // Adjust interval for speed
    }

    return () => clearInterval(idleInterval); // Clear interval on component unmount or when spinning starts
  }, [isSpinning]);

  const spinWheel = () => {
    if (isSpinning) return;

    setWinner(null);
    setPreviousIdleRotation(idleRotation); // Save current idle rotation
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
      const adjustedIdleRotation =
        (previousIdleRotation + (finalAngle - previousIdleRotation)) % 360;
      setIdleRotation(adjustedIdleRotation); // Continue smoothly
      const winningItem = getWinningItem(finalAngle);
      if (winningItem) {
        setWinner(winningItem);
        setShowModal(true); // Show modal
      }
    }, spinDuration);
  };

  const getWinningItem = (finalAngle: number): WheelItem | null => {
    const normalizedAngle = (360 - (finalAngle % 360) + 90) % 360;
    let currentAngle = 0;

    const validItems = wheelItems.filter(
      (item) => item.text !== '' && !item.used
    );

    for (const item of validItems) {
      currentAngle += item.percentage * 3.6;
      if (normalizedAngle <= currentAngle) {
        return item;
      }
    }

    return validItems[0] || null;
  };
  const calculateRotation = (index: number): number => {
    const validItems = wheelItems.filter((item) => item.text !== '');
    let totalPercentage = 0;
    for (let i = 0; i < index; i++) {
      totalPercentage += validItems[i].percentage;
    }
    return (totalPercentage / 100) * 360;
  };

  const resetUsedItems = () => {
    const newItems = wheelItems.map((item) => ({ ...item, used: false }));
    const validItems = newItems.filter((item) => item.text !== '');
    const newPercentage = 100 / validItems.length;

    const normalizedItems = newItems.map((item) =>
      item.text !== '' ? { ...item, percentage: newPercentage } : item
    );

    setWheelItems(normalizedItems);
    setWinner(null);
    setRotation(0);
    setIdleRotation(0);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-display">
                    {t('general:spinWheel.items')}
                  </Label>
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
                            <Trash2 className="font-display w-4 h-4 mr-2" />
                            {t('general:clear')}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-display">
                            {t('general:tools.clearTooltip')}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Switch
                      id="advanced"
                      checked={showAdvanced}
                      onCheckedChange={setShowAdvanced}
                    />
                    <Label className="font-display" htmlFor="advanced">
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
                  onQuickAdd={handleQuickAdd}
                  listLabel={t('general:spinWheel.items')}
                  quickAddLabel={t('general:spinWheel.quickAdd')}
                />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-display">
                  {t('general:spinWheel.usedItems')}
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetUsedItems}
                  disabled={!wheelItems.some((item) => item.used)}
                  className="font-display shadow-lg border-2 border-gray-400"
                >
                  {t('general:spinWheel.resetUsed')}
                </Button>
              </div>
              <div className="space-y-2">
                {wheelItems
                  .filter((item) => item.used)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 rounded-md bg-muted"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-display">{item.text}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-square">
            <motion.div
              className="w-full h-full"
              animate={{ rotate: isSpinning ? rotation : idleRotation }}
              transition={{
                duration: isSpinning ? 3 : 0,
                ease: isSpinning ? 'easeOut' : 'linear',
              }}
              style={{
                transformOrigin: 'center center',
                position: 'relative',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {wheelItems
                  .filter((item) => item.text !== '' && !item.used)
                  .map((item, index) => {
                    const startAngle = calculateRotation(index);
                    const endAngle = startAngle + (item.percentage / 100) * 360;
                    const largeArcFlag = item.percentage > 50 ? 1 : 0;

                    const startX =
                      50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
                    const startY =
                      50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
                    const endX =
                      50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
                    const endY =
                      50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));

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
                          className="font-display"
                          x={50}
                          y={50}
                          fill="white"
                          fontSize="4"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ userSelect: 'none' }}
                          transform={`
                            rotate(${(startAngle + endAngle) / 2}, 50, 50)
                            translate(0, -35)
                          `}
                        >
                          {item.text}
                        </text>
                      </g>
                    );
                  })}
              </svg>
            </motion.div>

            {/* Pointer */}
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
              <div
                className="w-8 h-8 bg-white shadow-lg"
                style={{
                  clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
                }}
              />
            </div>

            <Button
              className="font-display absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12 p-0"
              onClick={spinWheel}
              disabled={
                wheelItems.filter((item) => item.text !== '').length < 2
              }
            >
              {t('general:spinWheel.spin')}
            </Button>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <AnimatePresence>
        {winner && !isSpinning && (
          <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
            <DialogContent className="w-full">
              <p className="text-center font-display text-9xl text-black">
                {winner?.text}
              </p>

              {/* Buttons for closing and removing the winner */}
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setShowModal(false);
                    // Do not reset idleRotation; it will continue from the adjusted value
                  }}
                >
                  Close
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    if (winner) {
                      const updatedItems = wheelItems.filter(
                        (item) => item.id !== winner.id
                      );

                      // Recalculate percentages for remaining items
                      const validItems = updatedItems.filter(
                        (item) => item.text !== ''
                      );
                      const newPercentage = 100 / validItems.length;
                      const normalizedItems = updatedItems.map((item) =>
                        item.text !== ''
                          ? { ...item, percentage: newPercentage }
                          : item
                      );

                      setWheelItems(normalizePercentages(normalizedItems));
                      setCurrentItems(normalizedItems);
                      setShowModal(false);
                      setIdleRotation(rotation % 360);
                      // Save final rotation
                    }
                  }}
                >
                  Remove Winner
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
