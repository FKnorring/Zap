import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function HasAnsweredView() {
  const [typedText, setTypedText] = useState('');
  const { t } = useTranslation(['participants']);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 15);
    const fullQuote = t(`answeredQuotes.${randomIndex}`);
    setTypedText(fullQuote[0]);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < fullQuote.length - 1) {
        setTypedText((prev) => prev + fullQuote[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-display text-center">{typedText}</h1>
    </div>
  );
}
