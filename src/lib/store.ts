import { create } from 'zustand';

// Analysis results types
type AnalysisResult = {
  analysisText?: string;
  formattedAnalysis?: string;
  algorithmAnalysis?: any;
};

type ComplexityResult = {
  analysisText?: string;
  formattedAnalysis?: string;
  complexityAnalysis?: any;
};

type OptimizationResult = {
  optimizationText?: string;
  formattedAnalysis?: string;
  optimizationSuggestions?: any;
  optimizedCode?: string;
};

interface SolutionState {
  code: string;
  language: string;
  problemStatement: string;
  questionTitle: string;
  questionId: string;
  problemType: string;
  solutionHint: string;
  // Analysis results storage
  analysisResults: {
    [interviewId: string]: {
      analyze?: AnalysisResult;
      complexity?: ComplexityResult;
      optimize?: OptimizationResult;
    };
  };
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setProblemStatement: (problemStatement: string) => void;
  setQuestionTitle: (questionTitle: string) => void;
  setQuestionId: (questionId: string) => void;
  setProblemType: (problemType: string) => void;
  setSolutionHint: (solutionHint: string) => void;
  setSolutionData: (data: {
    code: string;
    language: string;
    problemStatement: string;
    questionTitle: string;
    questionId: string;
    problemType: string;
    solutionHint: string;
  }) => void;
  // Methods to set analysis results
  setAnalysisResult: (interviewId: string, result: AnalysisResult) => void;
  setComplexityResult: (interviewId: string, result: ComplexityResult) => void;
  setOptimizationResult: (interviewId: string, result: OptimizationResult) => void;
  getResultsForInterview: (interviewId: string) => {
    analyze?: AnalysisResult;
    complexity?: ComplexityResult;
    optimize?: OptimizationResult;
  } | null;
}

// Create a store for solution data
export const useSolutionStore = create<SolutionState>((set, get) => ({
  code: '',
  language: 'javascript',
  problemStatement: '',
  questionTitle: '',
  questionId: '',
  problemType: '',
  solutionHint: '',
  analysisResults: {},
  
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setProblemStatement: (problemStatement) => set({ problemStatement }),
  setQuestionTitle: (questionTitle) => set({ questionTitle }),
  setQuestionId: (questionId) => set({ questionId }),
  setProblemType: (problemType) => set({ problemType }),
  setSolutionHint: (solutionHint) => set({ solutionHint }),
  
  // Helper method to set all data at once
  setSolutionData: (data) => set(data),
  
  // Methods to set analysis results
  setAnalysisResult: (interviewId, result) => set((state) => {
    const currentResults = state.analysisResults[interviewId] || {};
    return {
      analysisResults: {
        ...state.analysisResults,
        [interviewId]: {
          ...currentResults,
          analyze: result,
        }
      }
    };
  }),
  
  setComplexityResult: (interviewId, result) => set((state) => {
    const currentResults = state.analysisResults[interviewId] || {};
    return {
      analysisResults: {
        ...state.analysisResults,
        [interviewId]: {
          ...currentResults,
          complexity: result,
        }
      }
    };
  }),
  
  setOptimizationResult: (interviewId, result) => set((state) => {
    const currentResults = state.analysisResults[interviewId] || {};
    return {
      analysisResults: {
        ...state.analysisResults,
        [interviewId]: {
          ...currentResults,
          optimize: result,
        }
      }
    };
  }),
  
  getResultsForInterview: (interviewId) => {
    return get().analysisResults[interviewId] || null;
  }
})); 