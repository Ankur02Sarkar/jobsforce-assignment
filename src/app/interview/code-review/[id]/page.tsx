"use client";

import { useState, useEffect } from "react";
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
    solutionHint,
    // Add analysis methods from store
    setAnalysisResult: storeAnalysisResult,
    setComplexityResult: storeComplexityResult,
    setOptimizationResult: storeOptimizationResult,
    getResultsForInterview
  } = useSolutionStore();

  // State variables
  const [selectedTab, setSelectedTab] = useState<AnalysisTab>("analyze");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [optimizedCode, setOptimizedCode] = useState<string>("");
  const [optimizationFocus, setOptimizationFocus] = useState<"time" | "space">("time");
  const [hasRunAnalysis, setHasRunAnalysis] = useState<{
    analyze: boolean;
    complexity: boolean;
    optimize: boolean;
  }>({ analyze: false, complexity: false, optimize: false });

  // Effect to load stored results when tab changes
  useEffect(() => {
    if (!interviewId) return;
    
    const storedResults = getResultsForInterview(interviewId);
    if (!storedResults) return;
    
    // Update hasRunAnalysis based on stored results
    setHasRunAnalysis(prev => ({
      analyze: !!storedResults.analyze?.formattedAnalysis || prev.analyze,
      complexity: !!storedResults.complexity?.formattedAnalysis || prev.complexity,
      optimize: !!storedResults.optimize?.formattedAnalysis || prev.optimize
    }));
    
    // Load the appropriate results based on selected tab
    if (selectedTab === "analyze" && storedResults.analyze) {
      if (storedResults.analyze.formattedAnalysis) {
        setAnalysisResult(storedResults.analyze.formattedAnalysis);
      }
    } else if (selectedTab === "complexity" && storedResults.complexity) {
      if (storedResults.complexity.formattedAnalysis) {
        setAnalysisResult(storedResults.complexity.formattedAnalysis);
      }
    } else if (selectedTab === "optimize" && storedResults.optimize) {
      if (storedResults.optimize.formattedAnalysis) {
        setAnalysisResult(storedResults.optimize.formattedAnalysis);
      }
      if (storedResults.optimize.optimizedCode) {
        setOptimizedCode(storedResults.optimize.optimizedCode);
      }
    } else {
      // Clear results if we don't have stored data for this tab
      setAnalysisResult("");
      if (selectedTab !== "optimize") {
        setOptimizedCode("");
      }
    }
  }, [selectedTab, interviewId, getResultsForInterview]);

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
          // Store the full response data instead of just text
          if (result.data.analysisText && result.data.algorithmAnalysis) {
            // Format both text analysis and structured algorithm analysis data
            const analysis = result.data.algorithmAnalysis;
            let formattedAnalysis = `<div class="space-y-4">`;
            
            // General analysis text
            formattedAnalysis += `<div class="mb-4">
              <h3 class="text-lg font-medium mb-1">General Analysis</h3>
              <p>${result.data.analysisText}</p>
            </div>`;
            
            // Approach identified
            if (analysis.approachIdentified) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Approach Identified</h3>
                <p>${analysis.approachIdentified}</p>
              </div>`;
            }
            
            // Optimization tips
            if (analysis.optimizationTips && analysis.optimizationTips.length > 0) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Optimization Tips</h3>
                <ul class="list-disc pl-5 space-y-1">
                  ${analysis.optimizationTips.map((tip: string) => `<li>${tip}</li>`).join('')}
                </ul>
              </div>`;
            }
            
            // Edge cases feedback
            if (analysis.edgeCasesFeedback && analysis.edgeCasesFeedback.length > 0) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Edge Cases Feedback</h3>
                <ul class="list-disc pl-5 space-y-1">
                  ${analysis.edgeCasesFeedback.map((feedback: string) => `<li>${feedback}</li>`).join('')}
                </ul>
              </div>`;
            }
            
            // Alternative approaches
            if (analysis.alternativeApproaches && analysis.alternativeApproaches.length > 0) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Alternative Approaches</h3>
                <div class="space-y-3">
                  ${analysis.alternativeApproaches.map((approach: any) => `
                    <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded-md">
                      <div class="font-medium">${approach.description}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Complexity:</span> ${approach.complexity}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Suitability:</span> ${approach.suitability}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>`;
            }
            
            formattedAnalysis += `</div>`;
            setAnalysisResult(formattedAnalysis);
            
            // Store in Zustand and mark as analyzed
            if (interviewId) {
              storeAnalysisResult(interviewId, {
                analysisText: result.data.analysisText,
                algorithmAnalysis: result.data.algorithmAnalysis,
                formattedAnalysis
              });
              setHasRunAnalysis(prev => ({ ...prev, analyze: true }));
            }
          } else if (result.data.analysisText) {
            // Format existing analysis as a string
            setAnalysisResult(result.data.analysisText);
            
            // Store in Zustand and mark as analyzed
            if (interviewId) {
              storeAnalysisResult(interviewId, {
                analysisText: result.data.analysisText,
                formattedAnalysis: result.data.analysisText
              });
              setHasRunAnalysis(prev => ({ ...prev, analyze: true }));
            }
          } else if (result.data.algorithmAnalysis) {
            // Format structured algorithm analysis data
            const analysis = result.data.algorithmAnalysis;
            let formattedAnalysis = `<div class="space-y-4">`;
            
            // Approach identified
            if (analysis.approachIdentified) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Approach Identified</h3>
                <p>${analysis.approachIdentified}</p>
              </div>`;
            }
            
            // Optimization tips
            if (analysis.optimizationTips && analysis.optimizationTips.length > 0) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Optimization Tips</h3>
                <ul class="list-disc pl-5 space-y-1">
                  ${analysis.optimizationTips.map((tip: string) => `<li>${tip}</li>`).join('')}
                </ul>
              </div>`;
            }
            
            // Edge cases feedback
            if (analysis.edgeCasesFeedback && analysis.edgeCasesFeedback.length > 0) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Edge Cases Feedback</h3>
                <ul class="list-disc pl-5 space-y-1">
                  ${analysis.edgeCasesFeedback.map((feedback: string) => `<li>${feedback}</li>`).join('')}
                </ul>
              </div>`;
            }
            
            // Alternative approaches
            if (analysis.alternativeApproaches && analysis.alternativeApproaches.length > 0) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Alternative Approaches</h3>
                <div class="space-y-3">
                  ${analysis.alternativeApproaches.map((approach: any) => `
                    <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded-md">
                      <div class="font-medium">${approach.description}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Complexity:</span> ${approach.complexity}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Suitability:</span> ${approach.suitability}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>`;
            }
            
            formattedAnalysis += `</div>`;
            setAnalysisResult(formattedAnalysis);
            
            // Store in Zustand and mark as analyzed
            if (interviewId) {
              storeAnalysisResult(interviewId, {
                algorithmAnalysis: result.data.algorithmAnalysis,
                formattedAnalysis
              });
              setHasRunAnalysis(prev => ({ ...prev, analyze: true }));
            }
          } else {
            setAnalysisResult("No analysis available");
          }
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
          if (result.data.complexityAnalysis && typeof result.data.complexityAnalysis === 'object') {
            // Format structured complexity analysis data
            const analysis = result.data.complexityAnalysis;
            let formattedAnalysis = `<div class="space-y-4">`;
            
            // General analysis text if available
            if (result.data.analysisText) {
              formattedAnalysis += `<div class="mb-4">
                <h3 class="text-lg font-medium mb-1">Analysis Overview</h3>
                <p>${result.data.analysisText}</p>
              </div>`;
            }
            
            // Time complexity
            if (analysis.timeComplexity) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Time Complexity</h3>`;
              
              if (typeof analysis.timeComplexity === 'string') {
                formattedAnalysis += `<p class="font-mono bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded inline-block">${analysis.timeComplexity}</p>`;
              } else {
                // Handle structured time complexity object with best, average, worst cases
                formattedAnalysis += `<div class="grid grid-cols-3 gap-2 mb-2">
                  <div class="bg-gray-50 dark:bg-slate-800 p-2 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Best Case</div>
                    <div class="font-mono font-medium">${analysis.timeComplexity.bestCase || 'N/A'}</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-slate-800 p-2 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Average Case</div>
                    <div class="font-mono font-medium">${analysis.timeComplexity.averageCase || 'N/A'}</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-slate-800 p-2 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Worst Case</div>
                    <div class="font-mono font-medium">${analysis.timeComplexity.worstCase || 'N/A'}</div>
                  </div>
                </div>`;
              }
              
              if (analysis.timeComplexityExplanation) {
                formattedAnalysis += `<p class="mt-1">${analysis.timeComplexityExplanation}</p>`;
              }
              
              formattedAnalysis += `</div>`;
            }
            
            // Space complexity
            if (analysis.spaceComplexity) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Space Complexity</h3>
                <p class="font-mono bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded inline-block">${analysis.spaceComplexity}</p>
                ${analysis.spaceComplexityExplanation ? `<p class="mt-1">${analysis.spaceComplexityExplanation}</p>` : ''}
              </div>`;
            }
            
            // Critical operations if available
            if (analysis.criticalOperations && analysis.criticalOperations.length > 0) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Critical Operations</h3>
                <div class="space-y-3">
                  ${analysis.criticalOperations.map((op: any) => `
                    <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded-md">
                      <div class="font-medium">${op.operation}</div>
                      <div class="text-sm mt-1">${op.impact}</div>
                      ${op.lineNumbers ? `
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Line${op.lineNumbers.length > 1 ? 's' : ''}: ${op.lineNumbers.join(', ')}
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>`;
            }
            
            // Comparison to optimal
            if (analysis.comparisonToOptimal) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Comparison to Optimal Solution</h3>
                <p>${analysis.comparisonToOptimal}</p>
              </div>`;
            }
            
            // Performance bottlenecks if available
            if (analysis.performanceBottlenecks && analysis.performanceBottlenecks.length > 0) {
              formattedAnalysis += `<div class="mb-3">
                <h3 class="text-lg font-medium mb-1">Performance Bottlenecks</h3>
                <ul class="list-disc pl-5 space-y-1">
                  ${analysis.performanceBottlenecks.map((bottleneck: string) => `<li>${bottleneck}</li>`).join('')}
                </ul>
              </div>`;
            }
            
            formattedAnalysis += `</div>`;
            setAnalysisResult(formattedAnalysis);
            
            // Store in Zustand and mark as analyzed
            if (interviewId) {
              storeComplexityResult(interviewId, {
                analysisText: result.data.analysisText,
                complexityAnalysis: result.data.complexityAnalysis,
                formattedAnalysis
              });
              setHasRunAnalysis(prev => ({ ...prev, complexity: true }));
            }
          } else if (result.data.analysisText) {
            // Use text analysis if available
            setAnalysisResult(result.data.analysisText);
            
            // Store in Zustand and mark as analyzed
            if (interviewId) {
              storeComplexityResult(interviewId, {
                analysisText: result.data.analysisText,
                formattedAnalysis: result.data.analysisText
              });
              setHasRunAnalysis(prev => ({ ...prev, complexity: true }));
            }
          } else if (typeof result.data.complexityAnalysis === 'string') {
            // Use string complexity analysis if that's what we got
            setAnalysisResult(result.data.complexityAnalysis);
            
            // Store in Zustand and mark as analyzed
            if (interviewId) {
              storeComplexityResult(interviewId, {
                complexityAnalysis: result.data.complexityAnalysis,
                formattedAnalysis: result.data.complexityAnalysis
              });
              setHasRunAnalysis(prev => ({ ...prev, complexity: true }));
            }
          } else {
            setAnalysisResult("No complexity analysis available");
          }
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
          let formattedAnalysis = `<div class="space-y-4">`;
          
          // General optimization text
          if (result.data.optimizationText) {
            formattedAnalysis += `<div class="mb-4">
              <h3 class="text-lg font-medium mb-1">Optimization Overview</h3>
              <p>${result.data.optimizationText}</p>
            </div>`;
          }
          
          // Optimization suggestions and improvements if available
          if (result.data.optimizationSuggestions && result.data.optimizationSuggestions.improvements) {
            const improvements = result.data.optimizationSuggestions.improvements;
            
            formattedAnalysis += `<div class="mb-3">
              <h3 class="text-lg font-medium mb-1">Improvements</h3>
              <div class="space-y-3">
                ${improvements.map((improvement: any) => `
                  <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded-md">
                    <div class="font-medium">${improvement.description}</div>
                    ${improvement.complexityBefore && improvement.complexityAfter ? `
                      <div class="flex items-center mt-2 text-sm">
                        <span class="mr-2">Complexity: </span>
                        <span class="font-mono bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">${improvement.complexityBefore}</span>
                        <span class="mx-2">→</span>
                        <span class="font-mono bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">${improvement.complexityAfter}</span>
                      </div>
                    ` : ''}
                    ${improvement.algorithmicChange ? `
                      <div class="text-sm mt-1">
                        <span class="font-medium">Algorithmic Change:</span> ${improvement.algorithmicChange}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>`;
          }
          
          // Improvement points if available from optimizationDetails
          if (result.data.optimizationDetails && result.data.optimizationDetails.improvementPoints && 
              result.data.optimizationDetails.improvementPoints.length > 0) {
            formattedAnalysis += `<div class="mb-3">
              <h3 class="text-lg font-medium mb-1">Improvement Points</h3>
              <ul class="list-disc pl-5 space-y-1">
                ${result.data.optimizationDetails.improvementPoints.map((point: string) => `<li>${point}</li>`).join('')}
              </ul>
            </div>`;
          }
          
          // Expected performance gains if available
          if (result.data.optimizationDetails && result.data.optimizationDetails.expectedPerformanceGains) {
            formattedAnalysis += `<div class="mb-3">
              <h3 class="text-lg font-medium mb-1">Expected Performance Gains</h3>
              <p>${result.data.optimizationDetails.expectedPerformanceGains}</p>
            </div>`;
          }
          
          formattedAnalysis += `</div>`;
          setAnalysisResult(formattedAnalysis);
          
          // Check if we have optimized code and set it
          const optimizedCodeText = result.data.optimizationSuggestions && (
            typeof result.data.optimizationSuggestions === 'string' 
              ? result.data.optimizationSuggestions 
              : result.data.optimizationSuggestions.optimizedCode || result.data.optimizationSuggestions.code || ''
          );
            
          if (optimizedCodeText) {
            setOptimizedCode(optimizedCodeText);
          }
          
          // Store in Zustand and mark as analyzed
          if (interviewId) {
            storeOptimizationResult(interviewId, {
              optimizationText: result.data.optimizationText,
              optimizationSuggestions: result.data.optimizationSuggestions,
              formattedAnalysis,
              optimizedCode: optimizedCodeText
            });
            setHasRunAnalysis(prev => ({ ...prev, optimize: true }));
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

  // Function to get placeholder text based on selected tab
  const getPlaceholderText = () => {
    if (selectedTab === "analyze") {
      return `<div class="text-center py-8">
        <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No Analysis Yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Run code analysis to get insights about your solution.</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Analysis will evaluate your approach, identify edge cases, and provide optimization tips.</p>
      </div>`;
    } else if (selectedTab === "complexity") {
      return `<div class="text-center py-8">
        <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No Complexity Analysis Yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Run complexity analysis to understand the time and space complexity of your code.</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">This will identify critical operations and compare your solution to optimal approaches.</p>
      </div>`;
    } else {
      return `<div class="text-center py-8">
        <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No Optimization Suggestions Yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Run optimization to get suggestions for improving your code.</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">Choose between optimizing for time or space complexity.</p>
      </div>`;
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
            onClick={() => {
              setSelectedTab("analyze");
            }}
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
            onClick={() => {
              setSelectedTab("complexity");
            }}
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
            onClick={() => {
              setSelectedTab("optimize");
            }}
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
        <div className="max-w-6xl mx-auto">
          {/* Responsive layout - Grid for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Code and Controls */}
            <div className="space-y-6">
              {/* Your Code Section */}
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <h2 className="font-medium text-gray-900 dark:text-white">
                    {selectedTab === "optimize" && optimizedCode 
                      ? "Optimized Solution" 
                      : "Your Solution"}
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{language}</div>
                </div>
                <div className="p-4">
                  <div className={styles.editorContainer}>
                    <CodeEditor
                      value={selectedTab === "optimize" && optimizedCode ? optimizedCode : code}
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
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4">
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

              {/* Original Solution (when optimized code is shown) */}
              {selectedTab === "optimize" && optimizedCode && (
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="font-medium text-gray-900 dark:text-white">
                      Original Solution
                    </h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{language}</div>
                  </div>
                  <div className="p-4">
                    <div className={styles.editorContainer}>
                      <CodeEditor
                        value={code}
                        onChange={() => {}} // Read-only
                        language={language}
                        readOnly={true}
                        className={styles.editor}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Run Analysis Button */}
              <div>
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
                        : optimizedCode ? "Re-Optimize" : "Optimization"
                    }`
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Analysis Results */}
            <div className="space-y-6">
              {/* Analysis Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden h-full"
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
                  {analysisResult ? (
                    // If we have analysis results
                    analysisResult.startsWith('<div') ? (
                      // If it's already HTML formatted, use dangerouslySetInnerHTML directly
                      <div dangerouslySetInnerHTML={{ __html: analysisResult }} />
                    ) : (
                      // Otherwise format as paragraphs with line breaks
                <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, "<br />") }} />
                    )
                  ) : (
                    // Show placeholder if no results for this tab
                    <div dangerouslySetInnerHTML={{ __html: getPlaceholderText() }} />
                  )}
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewPage; 