export default function MatchGroup({ title, options, background }: { title: string; options: string[]; background?: string }) {
  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div style={{ backgroundColor: background }} className="w-full p-8 rounded-lg flex flex-col items-center justify-center truncate">
        <h3 className="text-6xl font-bold">{title}</h3>
      </div>
      <ul className="mt-4 gap-4 flex flex-col w-full">
        {options?.map((option) => (
          <li key={option} className="flex-1 text-4xl font-semibold p-4 px-8 bg-card text-black rounded-lg">{option}</li>
        ))}
      </ul>
    </div>
  );
}