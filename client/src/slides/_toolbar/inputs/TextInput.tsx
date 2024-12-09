import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolbarProps } from "../../toolbar";
import { Textarea } from "@/components/ui/textarea";
import { Slide } from "@/models/Quiz";

interface TextInputProps<T extends Slide> extends ToolbarProps<T> {
  label: string;
  field: keyof T & string;
  placeholder: string;
  textArea?: boolean;
}

export default function TextInput<T extends Slide>({
  slide,
  onSlideUpdate,
  label,
  field,
  placeholder,
  textArea = false,
}: TextInputProps<T>) {
  const value = (slide[field] as string) || "";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
      </div>
      {textArea ? (
        <Textarea
          value={value}
          onChange={(e) => onSlideUpdate({ ...slide, [field]: e.target.value })}
          placeholder={placeholder}
          className="min-h-[50px] text-black"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onSlideUpdate({ ...slide, [field]: e.target.value })}
          className="text-xl font-bold"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
