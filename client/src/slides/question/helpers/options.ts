import { MCQMASlide, MCQSASlide } from "@/models/Quiz";
import { nanoid } from "nanoid";
import { max_options } from "@/config/max";

export type OptionSlide = MCQMASlide | MCQSASlide;

const MAX_OPTIONS = max_options.mcqma;

export function addOption(
  slide: OptionSlide,
  onSlideUpdate: (slide: OptionSlide) => void
) {
  if (!("options" in slide)) return;

  if (slide.options.length >= MAX_OPTIONS) return;

  onSlideUpdate({
    ...slide,
    options: [...slide.options, { id: nanoid(), text: "", isCorrect: false }],
  });
}

export function removeOption(
  slide: OptionSlide,
  optionId: string,
  onSlideUpdate: (slide: OptionSlide) => void
) {
  if (!("options" in slide)) return;

  onSlideUpdate({
    ...slide,
    options: slide.options.filter((opt) => opt.id !== optionId),
  });
}

export function updateOption(
  slide: OptionSlide,
  optionId: string,
  updates: Partial<{ text: string; isCorrect: boolean }>,
  onSlideUpdate: (slide: OptionSlide) => void
) {
  if (!("options" in slide)) return;

  onSlideUpdate({
    ...slide,
    options: slide.options.map((opt) =>
      opt.id === optionId
        ? { ...opt, ...updates }
        : slide.questionType === "MCQSA" &&
          "isCorrect" in updates &&
          updates.isCorrect
        ? { ...opt, isCorrect: false }
        : opt
    ),
  });
}
