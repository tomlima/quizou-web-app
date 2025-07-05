import { defineStore } from "pinia";
import type { Quiz } from "@/types/entity/quiz";
import type { Category } from "@/types/entity/category";
import type { PagedResult } from "@/types/entity/paged-result";
import type { Tag } from "@/types/entity/tag";
import { Difficulty, QuizStatus } from "@/types/unums/enum";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    quizzes: null as PagedResult<Quiz> | null,
    showQuizModal: false,
    currentQuiz: null as Quiz | null,
  }),
  actions: {
    startQuiz(quiz: Quiz) {
      this.currentQuiz = quiz;
      this.showQuizModal = true;
    },
    closeQuizModal() {
      this.showQuizModal = false;
    },
  }
});
