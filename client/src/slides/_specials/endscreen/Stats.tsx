import { Participant } from "@/models/Quiz";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";

// Import the correct components and types
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
// import Avatar from "@/Avatar";

export default function Stats({
  participants,
}: {
  participants: Participant[];
}) {
  const questions = participants[0].score.length;
  // Calculate accumulated scores for each participant
  const accumulatedScores = participants.map((participant) => {
    return participant.score.map((_, questionIndex) => {
      return participant.score.slice(0, questionIndex + 1).reduce((sum, score) => sum + score, 0);
    });
  });

  const chartData = Array.from({ length: questions }, (_, questionIndex) => {
    const dataPoint: { [key: string]: number } = {
      question: questionIndex + 1,
    };

    participants.forEach((participant, index) => {
      dataPoint[participant.name] = accumulatedScores[index][questionIndex];
    });

    return dataPoint;
  });

  // Define chart configuration
  const chartConfig = participants.reduce((acc, participant, index) => {
    // const Icon = Avatar
    return {
      ...acc,
      [participant.name]: {
        label: participant.name,
        color: `hsl(${(index * 360) / participants.length}, 70%, 50%)`,
        // icon: Icon
      }
    }
  }, {}) satisfies ChartConfig;

  return (
      <ChartContainer className="min-h-[200px] max-h-[700px] w-full bg-card p-8 rounded-lg" config={chartConfig}>
          <LineChart accessibilityLayer data={chartData}>
            <XAxis 
              dataKey="question" 
              name="Question" 
              label={{ value: 'Question Number', position: 'bottom' }} 
            />
            <YAxis 
              name="Score" 
              label={{ value: 'Accumulated Score', angle: -90, position: 'left' }} 
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent labelKey="question" />} />
            {participants.map((participant, index) => (
              <Line
                key={participant.name}
                type="monotone"
                dataKey={participant.name}
                stroke={`hsl(${(index * 360) / participants.length}, 70%, 50%)`}
                strokeWidth={2}
              />
            ))}
            <ChartLegend />
          </LineChart>
      </ChartContainer>
  );
}
