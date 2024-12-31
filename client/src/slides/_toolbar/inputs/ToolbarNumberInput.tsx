import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";

interface ToolbarNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  icon?: LucideIcon;
  placeholder?: string;
}

export function ToolbarNumberInput({ value, onChange, label, icon: Icon, placeholder }: ToolbarNumberInputProps) {
  const { t } = useTranslation(["toolbar"]);
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState(false);

  // Update local state when value prop changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue)) {
      setError(false);
      onChange(parsedValue);
    } else {
      setError(true);
    }
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Label>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        className={error ? "border-red-500" : ""}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-sm text-red-500">
          {t("invalidNumberError")}
        </p>
      )}
    </div>
  );
} 