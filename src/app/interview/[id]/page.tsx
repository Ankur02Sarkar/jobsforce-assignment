"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiGet, apiPut } from "@/lib/api";
import { 
  ArrowLeft, 
  CalendarIcon, 
  ClockIcon, 
  Code,
  ExternalLink,
  PlayCircle,
  CheckSquare,
  XSquare,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from "lucide-react";
import CodeEditor from "@/components/ui/code-editor";

// Interview type definition based on backend model
interface Interview {
  _id: string;
  title: string;
  date: string;
  status: "scheduled" | "pending" | "completed" | "cancelled";
  duration: number;
  questions?: Array<{
    question: string;
    answer?: string;
    score?: number;
    questionId?: number;
    timeTaken?: number;
  }>;
  feedback?: string;
  createdAt: string;
}

// API response type
interface InterviewResponse {
  success: boolean;
  data: Interview;
}

// Mock data for coding questions
const codingQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    tags: ["Array", "Hash Table"],
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    tags: ["Stack", "String"],
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description:
      "Merge two sorted linked lists and return it as a sorted list.",
    tags: ["Linked List", "Recursion"],
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description:
      "Find the contiguous subarray within an array (containing at least one number) which has the largest sum.",
    tags: ["Array", "Dynamic Programming"],
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    tags: ["String", "Dynamic Programming"],
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to format time in minutes and seconds
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const InterviewDetailPage = () => {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<{[key: number]: boolean}>({});
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id as string;

  useEffect(() => {
    // Fetch interview details when component mounts
    const fetchInterviewDetails = async () => {
      try {
        setLoading(true);
        const response = await apiGet<InterviewResponse>(`/api/interviews/${interviewId}`);
        
        if (response.success) {
          setInterview(response.data);
        } else {
          setError("Failed to load interview details");
        }
      } catch (error) {
        console.error("Error fetching interview details:", error);
        setError("An error occurred while fetching interview details");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchInterviewDetails();
    }
  }, [interviewId]);

  const startInterview = async () => {
    try {
      // Update interview status to 'in progress' or similar
      const response = await apiPut<InterviewResponse>(`/api/interviews/${interviewId}`, {
        status: "scheduled" // You might want a different status here
      });
      
      if (response.success) {
        setInterview(response.data);
        
        // Save the interview ID to localStorage before navigating to the question page
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentInterviewId', interviewId);
        }
        
        // Navigate to the first question with the interview ID as a query parameter
        router.push(`/interview/question/1?interviewId=${interviewId}`);
      }
    } catch (error) {
      console.error("Failed to start interview:", error);
      setError("Failed to start interview");
    }
  };

  // When navigating to a specific question, save the interview ID
  const navigateToQuestion = (questionId: number) => {
    // Save current interview ID to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentInterviewId', interviewId);
    }
    
    // Navigate to the question with interviewId as a query parameter
    router.push(`/interview/question/${questionId}?interviewId=${interviewId}`);
  };

  // Function to finish the test (mark as completed)
  const finishTest = async () => {
    try {
      setUpdating(true);
      const response = await apiPut<InterviewResponse>(`/api/interviews/${interviewId}`, {
        status: "completed"
      });
      
      if (response.success) {
        setInterview(response.data);
      } else {
        setError("Failed to update interview status");
      }
    } catch (error) {
      console.error("Failed to finish test:", error);
      setError("Failed to update interview status");
    } finally {
      setUpdating(false);
    }
  };

  // Function to end the test (mark as cancelled)
  const endTest = async () => {
    try {
      if (!confirm("Are you sure you want to cancel this interview? This action cannot be undone.")) {
        return;
      }
      
      setUpdating(true);
      const response = await apiPut<InterviewResponse>(`/api/interviews/${interviewId}`, {
        status: "cancelled"
      });
      
      if (response.success) {
        setInterview(response.data);
      } else {
        setError("Failed to update interview status");
      }
    } catch (error) {
      console.error("Failed to end test:", error);
      setError("Failed to update interview status");
    } finally {
      setUpdating(false);
    }
  };

  // Function to toggle question expansion
  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Function to determine the language from code
  const determineLanguage = (code: string): string => {
    if (code.includes('function') && code.includes(';')) return 'javascript';
    if (code.includes('def ') && code.includes(':')) return 'python';
    if (code.includes('class') && code.includes('{')) return 'java';
    if (code.includes('#include')) return 'cpp';
    return 'javascript'; // Default
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p>Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/interview" className="flex items-center text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Interviews
        </Link>
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || "Interview not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <Link href="/interview" className="flex items-center text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Interviews
        </Link>
        
        {/* Add status control buttons */}
        {interview && interview.status !== "completed" && interview.status !== "cancelled" && (
          <div className="flex space-x-3">
            <button
              onClick={finishTest}
              disabled={updating}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Finish Test
            </button>
            <button
              onClick={endTest}
              disabled={updating}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              <XSquare className="w-4 h-4 mr-2" />
              End Test
            </button>
          </div>
        )}
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {interview?.title}
              </h1>
              <span className={`ml-3 text-sm font-medium px-2.5 py-0.5 rounded-full ${
                interview?.status === "completed" ? "bg-green-100 text-green-800" :
                interview?.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                interview?.status === "cancelled" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {interview?.status.charAt(0).toUpperCase() + interview?.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              Complete the following coding challenges to showcase your skills
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-2 justify-end">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                {interview && new Date(interview.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-end">
              <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                {interview?.duration} minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Display "Interview Cancelled" message if status is cancelled */}
      {interview?.status === "cancelled" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          This interview has been cancelled.
        </div>
      )}

      {/* Only show coding questions if the interview is not cancelled */}
      {interview?.status !== "cancelled" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codingQuestions.map((question) => (
            <motion.div
              key={question.id}
              className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
              whileHover={{ y: -5 }}
              onClick={() => navigateToQuestion(question.id)}
              onHoverStart={() => setHoveredId(question.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}
                  >
                    {question.difficulty}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs">30 min</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white flex items-center">
                  {question.title}
                  {hoveredId === question.id && (
                    <ExternalLink className="ml-2 w-4 h-4 text-blue-500" />
                  )}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {question.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Code className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Coding
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {interview?.status === "completed" && interview.questions && interview.questions.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Your Interview Results</h2>
          
          <div className="space-y-6">
            {interview.questions.map((question, index) => (
              <div key={index} className="bg-gray-50 rounded-md overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="font-medium">Question {index + 1}: {question.question}</h3>
                  <div className="flex items-center">
                    {question.score !== undefined && (
                      <span className="text-sm font-medium mr-3 text-gray-600">
                        Score: <span className="text-green-600">{question.score}/10</span>
                      </span>
                    )}
                    {question.timeTaken !== undefined && (
                      <span className="text-sm font-medium mr-3 text-gray-600">
                        Time: <span className="text-blue-600">{formatTime(question.timeTaken)}</span>
                      </span>
                    )}
                    {expandedQuestions[index] ? 
                      <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                </div>
                
                {expandedQuestions[index] && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    {question.answer ? (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-700">Your Solution:</h4>
                          {question.timeTaken && (
                            <span className="text-xs font-medium text-gray-500">
                              Completed in {formatTime(question.timeTaken)}
                            </span>
                          )}
                        </div>
                        <div className="border rounded overflow-hidden">
                          <CodeEditor
                            value={question.answer}
                            onChange={() => {}}
                            language={determineLanguage(question.answer)}
                            placeholder=""
                            className="w-full h-full"
                            style={{ height: '250px' }}
                            readOnly={true}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic mt-2">No answer provided</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {interview.feedback && (
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Overall Feedback</h3>
              <p className="text-gray-800">{interview.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewDetailPage;
