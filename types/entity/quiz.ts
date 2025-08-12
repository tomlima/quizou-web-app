import type { Difficulty, QuizStatus } from "../unums/enum";
import type { Question } from "./question";
import type { Category } from "./category";

export interface Quiz {
  id: number;
  title: string;
  difficulty: Difficulty;
  description?: string | null;
  time: number;
  questions: Question[];
  status: QuizStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  featured: boolean;
  category: Category;
  image: string;
}
