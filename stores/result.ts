import { defineStore } from "pinia";
import type { Result } from "@/types/entity/result";

export const useResultStore = defineStore("result", {
  state: () => ({
    result: {} as Result, 
    resultModal: false as boolean 
  }), 
  actions: {
    setResult(value: Result){
      this.result = value; 
    },
    openResultModal(){
      this.resultModal = true 
    }, 
    closeResultModal(){
      this.resultModal = false 
    }
  }
});
