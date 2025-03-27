"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Code, ExternalLink } from "lucide-react";

// Mock data for coding questions
const codingQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    tags: ["Array", "Hash Table"],
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    tags: ["Stack", "String"],
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    tags: ["Linked List", "Recursion"],
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray within an array (containing at least one number) which has the largest sum.",
    tags: ["Array", "Dynamic Programming"],
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description: "Given a string s, return the longest palindromic substring in s.",
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

const JobInterview = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Coding Assessment
        </h1>
        <p className="text-gray-600 mt-2">
          Complete the following coding challenges to showcase your skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codingQuestions.map((question) => (
          <motion.div
            key={question.id}
            className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
            whileHover={{ y: -5 }}
            onHoverStart={() => setHoveredId(question.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <Link href={`/interview/question/${question.id}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
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
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobInterview;
