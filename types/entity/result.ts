import type { Quiz } from "@/types/entity/quiz"
import type { QuestionResponse } from "@/types/entity/question-response"

export interface Result {
  quiz: Quiz,
  questionsResponses: Array<QuestionResponse> 
}
