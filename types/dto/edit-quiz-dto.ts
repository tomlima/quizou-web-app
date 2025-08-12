export interface EditQuizDto {
  Id: number;
  Title: string;
  Difficulty: Number; // 0:easy | 1:medium | 2: hard
  Description: string;
  Time: number;
  Status: Number; // 0: draft | 1: active | 2: deleted | 3: archived
  CategoryId: Number;
  Tags: Number[];
  PublishedAt: Date;
  Image: string;
  Featured: boolean;
}
