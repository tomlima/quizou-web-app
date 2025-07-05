import type { Difficulty, QuizStatus } from "../unums/enum";
import type { Category } from "../entity/category.ts";
import type { Tag } from "../entity/tag";

export interface QuizDTO {
  title: string;
  difficulty: Difficulty;
  description: string;
  time: number;
  status: QuizStatus;
  category: Category;
  tag: Tag
  thumb: string;
}
