export interface QuizDTO {
  title: string;
  difficulty: Number; // 0:easy | 1:medium | 2: hard
  description: string;
  time: number;
  status: Number; // 0: draft | 1: active | 2: deleted | 3: archived
  categoryId: Number;
  tags: Number[]
  image: string;
}
