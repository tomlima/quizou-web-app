export interface CreateQuestionDto {
  Text: string,
  Difficulty: number,
  Order: number,
  QuizId: number
  Tags: number[]
}
