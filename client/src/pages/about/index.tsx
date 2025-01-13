import { useState, useEffect } from 'react';
import About from './About';
import AboutPhone from './AboutPhone';

export default function AboutPage() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isLargeScreen ? <About /> : <AboutPhone />;
}
