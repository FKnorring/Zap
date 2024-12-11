import { useState, useEffect } from 'react';

const quotes = [
  'Well, that was fast. But was it right? 🤔',
  'Speed isn’t everything... unless it’s wrong. 😅',
  "Quick answer! Let's hope it's not a quick mistake. 😏",
  'Are you confident, or just really fast? 🏎️',
  'Fast answer, bold move! Let’s see if it pays off. 🧐',
  'Thinking is overrated anyway, right? 😜',
  'That was speedy! But was it... considered? 🕵️',
  "You might have set a record for speed—accuracy, though? We'll see! 🕐",
  'Sometimes the first thought is the best—sometimes it’s not. 😇',
  'A quick answer is exciting, but accuracy is thrilling. 🎢',
  'Let’s hope your guess was as good as your speed. 🎯',
  'Confidence: 100%. Accuracy: We’ll see. 📊',
  'You didn’t even let your brain catch up. Respect. Kinda. 😏',
  'Fast fingers, fast mind? We’ll find out! 🧠',
  'Quick answer! But was it a quick decision? 🤔',
  'You’re fast! But are you right? 🤞',
];

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

export default function HasAnsweredView() {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const fullQuote = getRandomQuote(); // Randomly select the quote
    setTypedText(fullQuote[0]);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < fullQuote.length - 1) {
        setTypedText((prev) => prev + fullQuote[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval); // Stop the interval when the full quote is typed
      }
    }, 30); // Adjust typing speed (milliseconds per character)

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-display text-center">{typedText}</h1>
    </div>
  );
}
