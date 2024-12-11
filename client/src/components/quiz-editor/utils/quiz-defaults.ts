import { QuizSettings, ShowCorrectAnswerTypes } from "@/models/Quiz";
import { BackgroundStyle } from "../QuizBackground";

export const quizDefaults: QuizSettings = {
    primaryColor: "#FBAE3C",
    secondaryColor: "#498e77",
    backgroundColor: "#001220",
    backgroundStyleDefault: BackgroundStyle.BlobInverted,
    showCorrectAnswerDefault: ShowCorrectAnswerTypes.auto
}

export const quizDefaultsBackgroundStyles: BackgroundStyle[] = [
    BackgroundStyle.BlobInverted,
    BackgroundStyle.Blob,
    BackgroundStyle.Circle,
    BackgroundStyle.Solid,
    BackgroundStyle.Waves
]