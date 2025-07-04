import type { Answer } from "./answer"; // ajuste o caminho conforme necessário
import type { Difficulty } from "../unums/enum"; // ou onde você definiu o enum

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  difficulty: Difficulty;
  order: number;
  quizId: number;
}
