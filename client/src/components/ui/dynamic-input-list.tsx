import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';

export interface InputItem {
  id: string;
  text: string;
  color?: string;
  percentage?: number;
}

interface DynamicInputListProps {
  items: InputItem[];
  showAdvanced?: boolean;
  showColors?: boolean;
  onItemChange: (id: string, value: string) => void;
  onItemRemove: (id: string) => void;
  onPercentageChange?: (id: string, value: string) => void;
  inputPlaceholder?: string;
  quickAddPlaceholder?: string;
  onQuickAdd?: (items: string[]) => void;
  listLabel?: string;
  quickAddLabel?: string;
}

export function DynamicInputList({
  items,
  showAdvanced = false,
  showColors = false,
  onItemChange,
  onItemRemove,
  onPercentageChange,
  inputPlaceholder = "Enter value...",
  quickAddPlaceholder = "Value1, Value2, Value3...",
  onQuickAdd,
  listLabel,
  quickAddLabel,
}: DynamicInputListProps) {
  const [quickAdd, setQuickAdd] = useState('');
  const [quickAddError, setQuickAddError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (items.length === 0) {
      onItemChange(Date.now().toString(), '');
    }
  }, [items, onItemChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there's a next input, focus it
      if (index < items.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
      // If we're on the last input and it has content, a new input will be created and focused
      if (index === items.length - 1 && items[index].text !== '') {
        // Wait for the new input to be created
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  const handleQuickAdd = () => {
    if (!quickAdd.trim()) {
      setQuickAddError('Please enter some values');
      return;
    }

    const values = quickAdd.split(',').map((v: string) => v.trim()).filter((v: string) => v);
    if (values.some((v: string) => !v)) {
      setQuickAddError('Invalid format. Please ensure no empty values between commas');
      return;
    }

    onQuickAdd?.(values);
    setQuickAdd('');
    setQuickAddError('');
  };

  return (
    <div className="space-y-4">
      {onQuickAdd && false && (
        <div className="space-y-2">
          {quickAddLabel && <Label>{quickAddLabel}</Label>}
          <div className="flex space-x-2">
            <Input
              value={quickAdd}
              onChange={(e) => {
                setQuickAdd(e.target.value);
                setQuickAddError('');
              }}
              placeholder={quickAddPlaceholder}
            />
            <Button onClick={handleQuickAdd}>Add</Button>
          </div>
          {quickAddError && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{quickAddError}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="space-y-2">
        {listLabel && <Label>{listLabel}</Label>}
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-2">
            {showColors && item.color && (
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
            )}
            <Input
              ref={el => inputRefs.current[index] = el}
              value={item.text}
              onChange={(e) => onItemChange(item.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder={inputPlaceholder}
            />
            {showAdvanced && item.text !== '' && onPercentageChange && (
              <div className="flex items-center space-x-1">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round((item.percentage || 0) * 10) / 10}
                  onChange={(e) => onPercentageChange(item.id, e.target.value)}
                  className="w-20"
                />
                <span>%</span>
              </div>
            )}
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onItemRemove(item.id)}
                tabIndex={-1}
                className="focus:ring-0"
              >
                <X className="h-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 