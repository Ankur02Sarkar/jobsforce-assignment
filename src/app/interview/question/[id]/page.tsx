"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Code,
  PlayCircle,
  ArrowLeft,
  Clock,
  Save,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import createJudge0Client, { type SubmissionResult } from "@/lib/judge0";
import CodeEditor from "@/components/ui/code-editor";

// Mock data - in a real app, this would come from an API
const codingQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    fullDescription: `
# Two Sum

## Problem Statement
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.

## Examples
Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

## Constraints
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.

## Follow-up
Can you come up with an algorithm that is less than O(n²) time complexity?
    `,
    testCases: [
      { 
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: [0, 1],
        displayInput: "nums = [2,7,11,15], target = 9",
        displayOutput: "[0,1]"
      },
      { 
        input: { nums: [3, 2, 4], target: 6 },
        output: [1, 2],
        displayInput: "nums = [3,2,4], target = 6",
        displayOutput: "[1,2]"
      },
      { 
        input: { nums: [3, 3], target: 6 },
        output: [0, 1],
        displayInput: "nums = [3,3], target = 6",
        displayOutput: "[0,1]"
      }
    ],
    startingCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
};

// Example usage - DO NOT MODIFY THIS
function runTestCase(input) {
    return twoSum(input.nums, input.target);
}`,
      python: `def twoSum(nums, target):
    # Your code here
    pass
    
# Example usage - DO NOT MODIFY THIS
def runTestCase(input):
    return twoSum(input["nums"], input["target"])`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
    
    // Example usage - DO NOT MODIFY THIS
    public static int[] runTestCase(java.util.Map<String, Object> input) {
        int[] nums = (int[])input.get("nums");
        int target = (int)input.get("target");
        return new Solution().twoSum(nums, target);
    }
}`,
      cpp: `#include <vector>
#include <map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
    
    // Example usage - DO NOT MODIFY THIS
    static vector<int> runTestCase(map<string, void*> input) {
        vector<int>* nums = static_cast<vector<int>*>(input["nums"]);
        int target = *static_cast<int*>(input["target"]);
        return Solution().twoSum(*nums, target);
    }
};`,
    },
    sampleSolution: {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
      python: `def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []`,
    },
    tags: ["Array", "Hash Table"],
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    fullDescription: `
# Valid Parentheses

## Problem Statement
Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

## Examples
Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

## Constraints
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'
    `,
    testCases: [
      { 
        input: { s: "()" },
        output: true,
        displayInput: 's = "()"',
        displayOutput: "true"
      },
      { 
        input: { s: "()[]{}" },
        output: true,
        displayInput: 's = "()[]{}"',
        displayOutput: "true"
      },
      { 
        input: { s: "(]" },
        output: false,
        displayInput: 's = "(]"',
        displayOutput: "false"
      },
      { 
        input: { s: "([)]" },
        output: false,
        displayInput: 's = "([)]"',
        displayOutput: "false"
      },
      { 
        input: { s: "{[]}" },
        output: true,
        displayInput: 's = "{[]}"',
        displayOutput: "true"
      }
    ],
    startingCode: {
      javascript: `function isValid(s) {
    // Your code here
};

// Example usage - DO NOT MODIFY THIS
function runTestCase(input) {
    return isValid(input.s);
}`,
      python: `def isValid(s):
    # Your code here
    pass
    
# Example usage - DO NOT MODIFY THIS
def runTestCase(input):
    return isValid(input["s"])`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your code here
        return false;
    }
    
    // Example usage - DO NOT MODIFY THIS
    public static boolean runTestCase(java.util.Map<String, Object> input) {
        String s = (String)input.get("s");
        return new Solution().isValid(s);
    }
}`,
      cpp: `#include <string>
#include <map>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Your code here
        return false;
    }
    
    // Example usage - DO NOT MODIFY THIS
    static bool runTestCase(map<string, void*> input) {
        string* s = static_cast<string*>(input["s"]);
        return Solution().isValid(*s);
    }
};`,
    },
    sampleSolution: {
      javascript: `function isValid(s) {
    const stack = [];
    const map = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(' || s[i] === '[' || s[i] === '{') {
            stack.push(s[i]);
        } else {
            const lastBracket = stack.pop();
            if (map[lastBracket] !== s[i]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
};`,
      python: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    
    return not stack`,
    },
    tags: ["Stack", "String"],
  },
  // ... other questions
];

interface LanguageOption {
  label: string;
  value: string;
  mode: string;
}

const languageOptions: LanguageOption[] = [
  { label: "JavaScript", value: "javascript", mode: "javascript" },
  { label: "Python", value: "python", mode: "python" },
  { label: "Java", value: "java", mode: "java" },
  { label: "C++", value: "cpp", mode: "cpp" },
];

// Custom modal component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-md overflow-hidden shadow-xl transform transition-all">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <div className="mt-4">{children}</div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CodeQuestion = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const question = codingQuestions.find((q) => q.id === id);

  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("javascript");
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutes in seconds
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [customTestCase, setCustomTestCase] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Create Judge0 client
  const judge0Client = createJudge0Client();

  // Load the starting code when the language changes
  useEffect(() => {
    if (question) {
      setCode(
        question.startingCode[
          selectedLanguage as keyof typeof question.startingCode
        ] || "",
      );
    }
  }, [selectedLanguage, question]);

  // Set up the timer
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setIsTimeUpModalOpen(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft]);

  // Format the time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle running the code with Judge0
  const runCode = async () => {
    if (!question) return;

    setIsRunning(true);
    setOutput("Running your code...");

    try {
      // Check if we have RapidAPI key
      const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

      if (!rapidApiKey) {
        // Fallback to mock execution if no API key
        await mockExecution();
        return;
      }

      // Prepare test cases and wrapper code
      const wrapperCode = generateWrapperCode(code, selectedLanguage, question.testCases);

      // Execute code using Judge0
      const result = await judge0Client.executeCode(
        wrapperCode,
        selectedLanguage,
        "",  // No stdin needed as inputs are in the wrapper code
        true
      );

      processJudge0Result(result);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput(
        `Error running your code: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  // Generate wrapper code that runs each test case individually
  const generateWrapperCode = (userCode: string, language: string, testCases: any[]) => {
    switch (language) {
      case 'javascript':
        return `
${userCode}

// Test runner
function runTests() {
  const testCases = ${JSON.stringify(testCases.map(tc => tc.input))};
  const results = [];
  
  for (let i = 0; i < testCases.length; i++) {
    try {
      const result = runTestCase(testCases[i]);
      results.push({
        input: testCases[i],
        output: result,
        error: null
      });
    } catch (error) {
      results.push({
        input: testCases[i],
        output: null,
        error: error.message
      });
    }
  }
  
  console.log(JSON.stringify(results));
}

runTests();
`;
      case 'python':
        return `
${userCode}

# Test runner
import json

def run_tests():
    test_cases = ${JSON.stringify(testCases.map(tc => tc.input))}
    results = []
    
    for tc in test_cases:
        try:
            result = runTestCase(tc)
            results.append({
                "input": tc,
                "output": result,
                "error": None
            })
        except Exception as e:
            results.append({
                "input": tc,
                "output": None,
                "error": str(e)
            })
    
    print(json.dumps(results))

run_tests()
`;
      // Add similar wrappers for other languages
      default:
        return userCode;
    }
  };

  // Run a single custom test case
  const runCustomTestCase = async () => {
    if (!question || !customTestCase) return;

    setIsRunning(true);
    setOutput("Running your custom test case...");

    try {
      let parsedInput;
      try {
        // Try to parse the input as JSON
        parsedInput = JSON.parse(customTestCase);
      } catch (e) {
        setOutput("Invalid test case format. Please check your input.");
        setIsRunning(false);
        return;
      }

      // Create wrapper code for a single test case
      const singleTestCase = {
        input: parsedInput,
        displayInput: customTestCase
      };
      
      const wrapperCode = generateWrapperCode(code, selectedLanguage, [singleTestCase]);

      // Check if we have RapidAPI key
      const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

      if (!rapidApiKey) {
        // Fallback to mock execution if no API key
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockResult = `Custom Test Case Result:
Input: ${customTestCase}
Output: ${Math.random() > 0.5 ? JSON.stringify(question.testCases[0].output) : "Error: Runtime error"}`;
        setOutput(mockResult);
        setIsRunning(false);
        return;
      }

      // Execute code using Judge0
      const result = await judge0Client.executeCode(
        wrapperCode,
        selectedLanguage,
        "",
        true
      );

      // Process custom test case result
      processCustomTestResult(result, parsedInput);
      
    } catch (error) {
      console.error("Error running custom test:", error);
      setOutput(
        `Error running your custom test: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  // Process Judge0 result
  const processJudge0Result = (result: SubmissionResult) => {
    // Check for compilation errors
    if (result.compile_output) {
      setOutput(`Compilation Error:\n${result.compile_output}`);
      return;
    }

    // Check for runtime errors
    if (result.stderr) {
      setOutput(`Runtime Error:\n${result.stderr}`);
      return;
    }

    // Check status
    if (result.status.id !== 3) {
      // 3 = Accepted
      setOutput(
        `Execution Error: ${result.status.description}\n${result.message || ""}`,
      );
      return;
    }

    // Parse the results from stdout
    try {
      const output = result.stdout || "[]";
      const testResults = JSON.parse(output);
      
      // Format test case results
      const testCaseResults = question?.testCases
        .map((tc, idx) => {
          const testResult = testResults[idx];
          const passed = JSON.stringify(testResult.output) === JSON.stringify(tc.output);
          
          return `Test Case ${idx + 1}:
Input: ${tc.displayInput}
Expected: ${tc.displayOutput}
Your output: ${JSON.stringify(testResult.output)}
${testResult.error ? `Error: ${testResult.error}` : ''}
Status: ${passed ? "✅ Passed" : "❌ Failed"}`;
        })
        .join("\n\n");

      setOutput(`Test Results:\n\n${testCaseResults}`);

      // Check if all test cases passed
      const allPassed = testResults.every((res: any, idx: number) => 
        JSON.stringify(res.output) === JSON.stringify(question?.testCases[idx].output)
      );
      
      if (allPassed) {
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Error parsing test results:", error);
      setOutput(`Error parsing test results: ${error instanceof Error ? error.message : "Unknown error"}\n\nRaw output: ${result.stdout}`);
    }
  };

  // Process custom test result
  const processCustomTestResult = (result: SubmissionResult, input: any) => {
    // Check for compilation errors
    if (result.compile_output) {
      setOutput(`Compilation Error:\n${result.compile_output}`);
      return;
    }

    // Check for runtime errors
    if (result.stderr) {
      setOutput(`Runtime Error:\n${result.stderr}`);
      return;
    }

    // Parse the results from stdout
    try {
      const output = result.stdout || "[]";
      const testResults = JSON.parse(output);
      
      if (testResults.length > 0) {
        const testResult = testResults[0];
        
        const formattedResult = `Custom Test Case Result:
Input: ${JSON.stringify(input)}
Output: ${JSON.stringify(testResult.output)}
${testResult.error ? `Error: ${testResult.error}` : ''}
Execution Time: ${result.time || 'N/A'}s
Memory Used: ${result.memory || 'N/A'} KB`;

        setOutput(formattedResult);
      } else {
        setOutput("No results returned from execution.");
      }
    } catch (error) {
      console.error("Error parsing custom test result:", error);
      setOutput(`Error parsing test results: ${error instanceof Error ? error.message : "Unknown error"}\n\nRaw output: ${result.stdout}`);
    }
  };

  // Fallback mock execution
  const mockExecution = async () => {
    if (!question) return;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock output with proper test case format
    const testResults = question.testCases.map((tc, idx) => {
      const passed = Math.random() > 0.3; // 70% chance of passing for demo
      return {
        input: tc.input,
        expected: tc.output,
        output: passed ? tc.output : (idx % 2 === 0 ? [] : [1, 0]),
        passed
      };
    });

    const formattedResults = testResults.map((result, idx) => 
      `Test Case ${idx + 1}:
Input: ${question.testCases[idx].displayInput}
Expected: ${question.testCases[idx].displayOutput}
Your output: ${JSON.stringify(result.output)}
Status: ${result.passed ? "✅ Passed" : "❌ Failed"}`
    ).join("\n\n");

    setOutput(`Test Results:\n\n${formattedResults}`);

    // Only show success modal if all test cases pass
    if (testResults.every(r => r.passed)) {
      setIsSuccessModalOpen(true);
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    if (!question) return;

    setIsSubmitting(true);
    setOutput("Submitting your solution...");

    try {
      // Same as runCode but with submission flag
      const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

      if (!rapidApiKey) {
        await mockSubmission();
        return;
      }

      const wrapperCode = generateWrapperCode(code, selectedLanguage, question.testCases);

      const result = await judge0Client.executeCode(
        wrapperCode,
        selectedLanguage,
        "",
        true
      );

      processSubmissionResult(result);
    } catch (error) {
      console.error("Error submitting code:", error);
      setOutput(
        `Error submitting your solution: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process Judge0 result for submission
  const processSubmissionResult = (result: SubmissionResult) => {
    // Similar to processJudge0Result but shows success modal on success
    if (result.compile_output) {
      setOutput(`Compilation Error:\n${result.compile_output}`);
      return;
    }

    if (result.stderr) {
      setOutput(`Runtime Error:\n${result.stderr}`);
      return;
    }

    if (result.status.id !== 3) {
      setOutput(
        `Execution Error: ${result.status.description}\n${result.message || ""}`,
      );
      return;
    }

    try {
      const output = result.stdout || "[]";
      const testResults = JSON.parse(output);
      
      const testCaseResults = question?.testCases
        .map((tc, idx) => {
          const testResult = testResults[idx];
          const passed = JSON.stringify(testResult.output) === JSON.stringify(tc.output);
          
          return `Test Case ${idx + 1}:
Input: ${tc.displayInput}
Expected: ${tc.displayOutput}
Your output: ${JSON.stringify(testResult.output)}
${testResult.error ? `Error: ${testResult.error}` : ''}
Status: ${passed ? "✅ Passed" : "❌ Failed"}`;
        })
        .join("\n\n");

      const allPassed = testResults.every((res: any, idx: number) => 
        JSON.stringify(res.output) === JSON.stringify(question?.testCases[idx].output)
      );

      setOutput(`Submission Results:\n\n${testCaseResults}\n\nExecution Time: ${result.time}s\nMemory Used: ${result.memory} KB`);
      
      if (allPassed) {
        setIsSuccessModalOpen(true);
        
        // Clear timer as test is completed
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      }
    } catch (error) {
      console.error("Error parsing submission results:", error);
      setOutput(`Error parsing submission results: ${error instanceof Error ? error.message : "Unknown error"}\n\nRaw output: ${result.stdout}`);
    }
  };

  // Mock submission
  const mockSubmission = async () => {
    if (!question) return;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, we'll assume 70% chance of success
    const success = Math.random() > 0.3;
    
    const testResults = question.testCases.map((tc, idx) => {
      const passed = success || Math.random() > 0.3; 
      return {
        input: tc.input,
        expected: tc.output,
        output: passed ? tc.output : (idx % 2 === 0 ? [] : [1, 0]),
        passed
      };
    });

    const formattedResults = testResults.map((result, idx) => 
      `Test Case ${idx + 1}:
Input: ${question.testCases[idx].displayInput}
Expected: ${question.testCases[idx].displayOutput}
Your output: ${JSON.stringify(result.output)}
Status: ${result.passed ? "✅ Passed" : "❌ Failed"}`
    ).join("\n\n");

    setOutput(`Submission Results:\n\n${formattedResults}`);

    if (testResults.every(r => r.passed)) {
      setIsSuccessModalOpen(true);

      // Clear timer as test is completed
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };

  // Helper function to show sample solution
  const showSampleSolution = () => {
    if (question?.sampleSolution && question.sampleSolution[selectedLanguage as keyof typeof question.sampleSolution]) {
      setCode(question.sampleSolution[selectedLanguage as keyof typeof question.sampleSolution]);
    } else {
      setOutput("No sample solution available for the selected language.");
    }
  };

  if (!question) {
    return <div className="p-8">Question not found!</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/interview")}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl text-gray-900 dark:text-white">
            {question.title}
          </h1>
          <span
            className={`ml-3 text-xs font-medium px-2 py-1 rounded-full ${
              question.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : question.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {question.difficulty}
          </span>
        </div>
        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span
              className={`font-mono ${timeLeft < 60 ? "text-red-500" : "text-gray-600 dark:text-gray-300"}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning || isSubmitting}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              {isRunning ? "Running..." : "Run Code"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="vertical">
          {/* Top Section with Problem and Code Editor side by side */}
          <Panel defaultSize={70} minSize={40}>
            <PanelGroup direction="horizontal">
              {/* Problem Description Panel */}
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full overflow-auto p-6 bg-white dark:bg-slate-900">
                  <div className="prose dark:prose-invert max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: question.fullDescription.replace(/\n/g, "<br />"),
                      }}
                    />

                    <h3 className="mt-6">Example Test Cases</h3>
                    <div className="mt-4 space-y-4">
                      {question.testCases.map((testCase, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-slate-800 p-4 rounded-md"
                        >
                          <div className="font-mono text-sm">
                            <div>
                              <strong>Input:</strong> {testCase.displayInput}
                            </div>
                            <div>
                              <strong>Output:</strong> {testCase.displayOutput}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>

              {/* Horizontal Resize Handle */}
              <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors" />

              {/* Code Editor Panel */}
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col">
                  <div className="px-4 py-2 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
                    <Code className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Code Editor
                    </span>
                    <div className="ml-auto flex items-center space-x-2">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 rounded px-2 py-1 text-gray-700 dark:text-gray-300"
                      >
                        {languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={showSampleSolution}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Show Solution
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-slate-950">
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={selectedLanguage}
                      placeholder="Write your code here..."
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          {/* Vertical Resize Handle */}
          <PanelResizeHandle className="h-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors" />

          {/* Output Panel */}
          <Panel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="px-4 py-2 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Output
                </span>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customTestCase}
                    onChange={(e) => setCustomTestCase(e.target.value)}
                    placeholder='Enter custom test case e.g. {"nums":[1,2,3],"target":3}'
                    className="text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 rounded px-2 py-1 text-gray-700 dark:text-gray-300 w-64"
                  />
                  <button
                    onClick={runCustomTestCase}
                    disabled={isRunning || isSubmitting || !customTestCase}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Run Custom Test
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-black text-green-400 font-mono text-sm whitespace-pre">
                {output || "Run your code to see the output..."}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Time Up Modal */}
      <Modal
        isOpen={isTimeUpModalOpen}
        onClose={() => setIsTimeUpModalOpen(false)}
        title="Time's Up!"
      >
        <p className="text-gray-600 dark:text-gray-400">
          Your time has expired. You can still submit your solution, but it will
          be marked as late.
        </p>
      </Modal>

      {/* Success Modal - Updated */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Test Passed!"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Congratulations! You&apos;ve successfully completed this challenge.
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Time taken: {30 * 60 - timeLeft} seconds
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => router.push(`/interview/${params.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Return to Challenges
              </button>
              {question && question.id < codingQuestions.length && (
                <button
                  onClick={() =>
                    router.push(`/interview/question/${question.id + 1}`)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CodeQuestion;
