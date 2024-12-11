import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0 bg-black/50">
      <Loader2 className="animate-spin" size={64} />
    </div>
  );
}
