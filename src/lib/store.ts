import { create } from 'zustand';

interface SolutionState {
  code: string;
  language: string;
  problemStatement: string;
  questionTitle: string;
  questionId: string;
  problemType: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setProblemStatement: (problemStatement: string) => void;
  setQuestionTitle: (questionTitle: string) => void;
  setQuestionId: (questionId: string) => void;
  setProblemType: (problemType: string) => void;
  setSolutionData: (data: {
    code: string;
    language: string;
    problemStatement: string;
    questionTitle: string;
    questionId: string;
    problemType: string;
  }) => void;
}

// Create a store for solution data
export const useSolutionStore = create<SolutionState>((set) => ({
  code: '',
  language: 'javascript',
  problemStatement: '',
  questionTitle: '',
  questionId: '',
  problemType: '',
  
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setProblemStatement: (problemStatement) => set({ problemStatement }),
  setQuestionTitle: (questionTitle) => set({ questionTitle }),
  setQuestionId: (questionId) => set({ questionId }),
  setProblemType: (problemType) => set({ problemType }),
  
  // Helper method to set all data at once
  setSolutionData: (data) => set(data),
})); 