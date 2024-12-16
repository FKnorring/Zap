import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { WiggleText } from '@/components/WiggleText';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

function Home() {
  const { login, register } = useKindeAuth();

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <WiggleText
        text="Zap!"
        className="text-7xl font-bold font-display mb-16 fancy-wrap"
      />
      <div className="flex flex-col gap-4">
        <Link to="/play" className="w-full">
          <Button className="font-display text-3xl outline outline-3" size="lg">
            <Play className="mr-2" size={24} />
            Play
          </Button>
        </Link>
        <Button
          className="font-display text-3xl outline outline-3"
          size="lg"
          onClick={() => login()}
        >
          Login
        </Button>
        <Button
          className="font-display text-3xl outline outline-3"
          size="lg"
          onClick={() => register()}
        >
          Register
        </Button>
      </div>
    </div>
  );
}

export default Home;
