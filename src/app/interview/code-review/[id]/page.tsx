"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Code, BarChart2, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CodeEditor from "@/components/ui/code-editor";
import { apiPost } from "@/lib/api";
import { useSolutionStore } from "@/lib/store";
import styles from "./code-review.module.css";

// Tabs for different analyses
type AnalysisTab = "analyze" | "complexity" | "optimize";

// Function to check if a string is a valid MongoDB ObjectId format
function isValidObjectId(id: string | null): boolean {
  if (!id) return false;
  // MongoDB ObjectIds are 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Component for the code review page
const CodeReviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(params.id);
  const interviewIdParam = searchParams.get("interviewId");
  
  // Only pass a valid MongoDB ObjectId to the API
  const interviewId = isValidObjectId(interviewIdParam) ? interviewIdParam : null;

  // Get solution data from Zustand store
  const { 
    code, 
    language, 
    problemStatement, 
    questionTitle, 
    questionId, 
    problemType,
    solutionHint 
  } = useSolutionStore();

  // State variables
  const [selectedTab, setSelectedTab] = useState<AnalysisTab>("analyze");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [optimizedCode, setOptimizedCode] = useState<string>("");
  const [optimizationFocus, setOptimizationFocus] = useState<"time" | "space">("time");

  // Function to analyze the code
  const analyzeCode = async () => {
    setIsLoading(true);
    setAnalysisResult("");
    setOptimizedCode("");

    try {
      // For debugging
      console.log("Analysis request with:", {
        tab: selectedTab,
        questionId,
        interviewId,
        codeLength: code.length,
        interviewIdValid: isValidObjectId(interviewId)
      });
      
      if (!interviewId || !isValidObjectId(interviewId)) {
        setAnalysisResult("Error: Invalid or missing interview ID. Please return to the challenge and try again.");
        setIsLoading(false);
        return;
      }
      
      // Call the appropriate API endpoint based on the selected tab
      let result;
      
      if (selectedTab === "analyze") {
        result = await apiPost<any>("/api/ai/analyze-solution", {
          code,
          language,
          problemStatement,
          interviewId,
          questionId: questionId || null,
        });

        if (result.success) {
          setAnalysisResult(result.data.analysisText || result.data.algorithmAnalysis || "No analysis available");
        }
      } 
      else if (selectedTab === "complexity") {
        result = await apiPost<any>("/api/ai/complexity-analysis", {
          code,
          language,
          problemType,
          interviewId,
          questionId: questionId || null,
        });

        if (result.success) {
          setAnalysisResult(result.data.analysisText || result.data.complexityAnalysis || "No analysis available");
        }
      } 
      else if (selectedTab === "optimize") {
        result = await apiPost<any>("/api/ai/optimize-solution", {
          code,
          language,
          problemStatement,
          optimizationFocus,
          interviewId, 
          questionId: questionId || null,
          solutionHint: solutionHint
        });

        if (result.success) {
          setAnalysisResult(result.data.optimizationText || "No optimization text available");
          // Check if we have optimized code and set it
          if (result.data.optimizationSuggestions) {
            const optimizedCodeText = typeof result.data.optimizationSuggestions === 'string' 
              ? result.data.optimizationSuggestions 
              : result.data.optimizationSuggestions.code || '';
            
            setOptimizedCode(optimizedCodeText);
          }
        }
      }
      
      console.log(`${selectedTab} analysis successful:`, result?.success);
      
    } catch (error) {
      console.error(`Error in ${selectedTab} analysis:`, error);
      
      // Get detailed error message if available
      let errorMessage = "Error occurred during analysis. Please try again later.";
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as any;
        if (errorObj.response?.data?.message) {
          errorMessage = `Server error: ${errorObj.response.data.message}`;
        }
        
        // Log the full error response for debugging
        console.error("Full error response:", errorObj.response?.data);
      }
      
      setAnalysisResult(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect back to questions if code is not available
  if (!code && typeof window !== 'undefined') {
    router.push('/interview');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl text-gray-900 dark:text-white">
            Code Review: {questionTitle}
          </h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setSelectedTab("analyze")}
            className={`px-4 py-2 rounded-md flex items-center font-medium transition-colors ${
              selectedTab === "analyze"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Code className="w-4 h-4 mr-2" />
            Analyze Code
          </button>
          <button
            onClick={() => setSelectedTab("complexity")}
            className={`px-4 py-2 rounded-md flex items-center font-medium transition-colors ${
              selectedTab === "complexity"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Time & Space Complexity
          </button>
          <button
            onClick={() => setSelectedTab("optimize")}
            className={`px-4 py-2 rounded-md flex items-center font-medium transition-colors ${
              selectedTab === "optimize"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Optimize Solution
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Your Code Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="font-medium text-gray-900 dark:text-white">Your Solution</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">{language}</div>
            </div>
            <div className="p-4">
              <div className={styles.editorContainer}>
                <CodeEditor
                  value={code}
                  onChange={() => {}} // Read-only
                  language={language}
                  placeholder="Your code will appear here..."
                  readOnly={true}
                  className={styles.editor}
                />
              </div>
            </div>
          </div>

          {/* Options for Optimize Tab */}
          {selectedTab === "optimize" && (
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm mb-6 p-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Optimize for:
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setOptimizationFocus("time")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      optimizationFocus === "time"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    Time Complexity
                  </button>
                  <button
                    onClick={() => setOptimizationFocus("space")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      optimizationFocus === "space"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    Space Complexity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Run Analysis Button */}
          <div className="mb-6">
            <button
              onClick={analyzeCode}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : selectedTab === "analyze"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : selectedTab === "complexity"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                `Run ${
                  selectedTab === "analyze"
                    ? "Code Analysis"
                    : selectedTab === "complexity"
                    ? "Complexity Analysis"
                    : "Optimization"
                }`
              )}
            </button>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h2 className="font-medium text-gray-900 dark:text-white">
                  {selectedTab === "analyze"
                    ? "Code Analysis"
                    : selectedTab === "complexity"
                    ? "Complexity Analysis"
                    : "Optimization Suggestions"}
                </h2>
              </div>
              <div className={`p-4 prose dark:prose-invert max-w-none ${styles.resultContainer}`}>
                <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, "<br />") }} />
              </div>
            </motion.div>
          )}

          {/* Optimized Code (only for optimize tab) */}
          {selectedTab === "optimize" && optimizedCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h2 className="font-medium text-gray-900 dark:text-white">
                  Optimized Solution
                </h2>
              </div>
              <div className="p-4">
                <div className={styles.editorContainer}>
                  <CodeEditor
                    value={optimizedCode}
                    onChange={() => {}} // Read-only
                    language={language}
                    readOnly={true}
                    className={styles.editor}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewPage; 