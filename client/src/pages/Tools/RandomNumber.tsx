import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import styles from './RandomNumber.module.css';

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const rollAnimation = {
  rotateX: [0, 360, 720, 1080],
  rotateY: [0, 360, 720, 1080],
  rotateZ: [0, 270, 540, 810],
  y: [0, -100, 50, 0],
  scale: [1, 1.1, 1.1, 1],
};

export default function RandomNumber() {
  const { t } = useTranslation();
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const generateNumber = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setResult(null);

    // Generate random number after animation
    setTimeout(() => {
      const randomNum = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      setResult(randomNum);
      setIsRolling(false);
    }, 3000);
  };

  const handleMinChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setMinNumber(num);
    }
  };

  const handleMaxChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setMaxNumber(num);
    }
  };

  // Random dice face for animation
  const RandomDiceFace = () => {
    const DiceIcon = diceIcons[Math.floor(Math.random() * diceIcons.length)];
    return <DiceIcon className="w-full h-full" />;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>{t('general:minNumber')}</Label>
                  <Input
                    type="number"
                    value={minNumber}
                    onChange={(e) => handleMinChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>{t('general:maxNumber')}</Label>
                  <Input
                    type="number"
                    value={maxNumber}
                    onChange={(e) => handleMaxChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8">
          <div className={styles['dice-wrapper']}>
            <AnimatePresence mode="wait">
              {isRolling ? (
                <motion.div
                  key="rolling"
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                  }}
                  initial={{ rotateX: 0, rotateY: 0, rotateZ: 0, y: 0, scale: 1 }}
                  animate={rollAnimation}
                  transition={{
                    duration: 3,
                    times: [0, 0.4, 0.8, 1],
                    ease: "easeInOut"
                  }}
                >
                  <div className={styles['dice-container']}>
                    <div className={`${styles['dice-face']} ${styles['dice-front']}`}>
                      <RandomDiceFace />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-back']}`}>
                      <RandomDiceFace />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-right']}`}>
                      <RandomDiceFace />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-left']}`}>
                      <RandomDiceFace />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-top']}`}>
                      <RandomDiceFace />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-bottom']}`}>
                      <RandomDiceFace />
                    </div>
                  </div>
                </motion.div>
              ) : result !== null ? (
                <motion.div
                  key="result"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <span className="text-6xl font-bold">{result}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateX(-25deg) rotateY(-25deg)",
                  }}
                >
                  <div className={styles['dice-container']}>
                    <div className={`${styles['dice-face']} ${styles['dice-front']}`}>
                      <Dice1 className="w-full h-full" />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-back']}`}>
                      <Dice6 className="w-full h-full" />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-right']}`}>
                      <Dice3 className="w-full h-full" />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-left']}`}>
                      <Dice4 className="w-full h-full" />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-top']}`}>
                      <Dice2 className="w-full h-full" />
                    </div>
                    <div className={`${styles['dice-face']} ${styles['dice-bottom']}`}>
                      <Dice5 className="w-full h-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            size="lg"
            onClick={generateNumber}
            disabled={isRolling || minNumber > maxNumber}
            className="w-48"
          >
            {t('general:roll')}
          </Button>
        </div>
      </div>
    </div>
  );
} 