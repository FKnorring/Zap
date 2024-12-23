import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getColor } from '@/slides/question/base/QuizColors';

export default function Team() {
  const { t } = useTranslation();
  const [amountOfTeams, setAmountOfTeams] = useState<number>(0);
  const [playerNames, setPlayerNames] = useState<string>('');
  const [teams, setTeams] = useState<string[][]>([]);
  const [open, setOpen] = useState<boolean>(false); // For modal visibility
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateTeams = (): void => {
    if (!playerNames.trim()) {
      alert('Please enter player names.');
      return;
    }
    if (amountOfTeams <= 0) {
      alert('Please select the number of teams.');
      return;
    }

    const players = playerNames
      .split(/[\s,]+/g)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (players.length < amountOfTeams) {
      alert('Not enough players for the selected number of teams.');
      return;
    }

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const generatedTeams: string[][] = Array.from(
      { length: amountOfTeams },
      () => []
    );

    shuffledPlayers.forEach((player, index) => {
      generatedTeams[index % amountOfTeams].push(player);
    });

    setTeams(generatedTeams);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setPlayerNames(value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleClear = () => {
    setPlayerNames('');
    setAmountOfTeams(0);
    setTeams([]);
    setOpen(false); // Close the modal
  };

  return (
    <div className="flex flex-col items-center justify-start overflow-hidden">
      <div className="text-center mt-4">
        <h1 className="font-display text-4xl">{t('general:teamGenerator')}</h1>
        <p className="m-2 text-center text-lg md:text-xl text-gray-300 font-display">
          {t('general:teamTitle')}
        </p>
      </div>
      <div
        className="flex-1 flex flex-col items-center justify-start overflow-y-auto "
        style={{ maxHeight: 'calc(90vh - 200px)' }}
      >
        <div className="">
          <Card className="mt-4 p-4 w-[350px]">
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label className="font-display text-2xl" htmlFor="name">
                      {t('general:playerNames')}
                    </Label>
                    <textarea
                      id="name"
                      placeholder="player1,player2..."
                      value={playerNames}
                      onChange={handleInputChange}
                      ref={textAreaRef}
                      rows={1} // Start with a single row
                      className="resize-none w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label className="font-display text-2xl" htmlFor="teams">
                      {t('general:numberOfTeams')}
                    </Label>
                    <Select
                      value={amountOfTeams.toString()}
                      onValueChange={(value) => setAmountOfTeams(Number(value))}
                    >
                      <SelectTrigger id="teams">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {[...Array(10).keys()].map((num) => (
                          <SelectItem
                            key={num + 1}
                            value={(num + 1).toString()}
                          >
                            {num + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              {/* Button to trigger modal */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">{t('general:clear')}</Button>
                </DialogTrigger>

                {/* Modal for confirmation */}
                <DialogContent>
                  <DialogTitle>{t('general:areYouSureDel')}</DialogTitle>
                  <DialogDescription>
                    {t('general:deletePlayerText')}
                  </DialogDescription>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      {t("general:cancel")}
                    </Button>
                    <Button onClick={handleClear}>
                      {t('general:confirm')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button onClick={handleGenerateTeams}>{t('general:Go')}</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Teams Container with Scroll */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10 w-full ">
          {teams.map((team, index) => (
            <Card
              key={index}
              className="w-[300px] shadow-lg border-white border-2"
              style={{ backgroundColor: getColor(index) }}
            >
              <CardHeader>
                <CardTitle>Team {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {team.map((player, idx) => (
                    <li className="font-display text-xl" key={idx}>
                      {player}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
