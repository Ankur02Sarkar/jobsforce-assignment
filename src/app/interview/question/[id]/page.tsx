"use client";

import CodeEditor from "@/components/ui/code-editor";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import createJudge0Client, { type SubmissionResult } from "@/lib/judge0";
import { useSolutionStore } from "@/lib/store";
import axios from "axios";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Code,
  ExternalLink,
  Lock,
  PlayCircle,
  Save,
  Wand2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
        displayOutput: "[0,1]",
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        output: [1, 2],
        displayInput: "nums = [3,2,4], target = 6",
        displayOutput: "[1,2]",
      },
      {
        input: { nums: [3, 3], target: 6 },
        output: [0, 1],
        displayInput: "nums = [3,3], target = 6",
        displayOutput: "[0,1]",
      },
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
    problemType: "Array",
    solutionHint:
      "Use a hash map to store previously seen values and their indices for O(1) lookups.",
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
        displayOutput: "true",
      },
      {
        input: { s: "()[]{}" },
        output: true,
        displayInput: 's = "()[]{}"',
        displayOutput: "true",
      },
      {
        input: { s: "(]" },
        output: false,
        displayInput: 's = "(]"',
        displayOutput: "false",
      },
      {
        input: { s: "([)]" },
        output: false,
        displayInput: 's = "([)]"',
        displayOutput: "false",
      },
      {
        input: { s: "{[]}" },
        output: true,
        displayInput: 's = "{[]}"',
        displayOutput: "true",
      },
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
    problemType: "Stack",
    solutionHint:
      "Use a stack to track opening brackets and verify matching closing brackets in the correct order.",
  },
//   {
//     id: 3,
//     title: "Merge Two Sorted Lists",
//     difficulty: "Easy",
//     description:
//       "Merge two sorted linked lists and return it as a sorted list.",
//     fullDescription: `
// # Merge Two Sorted Lists

// ## Problem Statement
// You are given the heads of two sorted linked lists \`list1\` and \`list2\`.
// Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.
// Return the head of the merged linked list.

// ## Examples
// Example 1:
// Input: list1 = [1,2,4], list2 = [1,3,4]
// Output: [1,1,2,3,4,4]

// Example 2:
// Input: list1 = [], list2 = []
// Output: []

// Example 3:
// Input: list1 = [], list2 = [0]
// Output: [0]

// ## Constraints
// - The number of nodes in both lists is in the range [0, 50].
// - -100 <= Node.val <= 100
// - Both \`list1\` and \`list2\` are sorted in **non-decreasing** order.
//     `,
//     testCases: [
//       {
//         input: {
//           list1: { val: 1, next: { val: 2, next: { val: 4, next: null } } },
//           list2: { val: 1, next: { val: 3, next: { val: 4, next: null } } },
//         },
//         output: {
//           val: 1,
//           next: {
//             val: 1,
//             next: {
//               val: 2,
//               next: { val: 3, next: { val: 4, next: { val: 4, next: null } } },
//             },
//           },
//         },
//         displayInput: "list1 = [1,2,4], list2 = [1,3,4]",
//         displayOutput: "[1,1,2,3,4,4]",
//       },
//       {
//         input: { list1: null, list2: null },
//         output: null,
//         displayInput: "list1 = [], list2 = []",
//         displayOutput: "[]",
//       },
//       {
//         input: { list1: null, list2: { val: 0, next: null } },
//         output: { val: 0, next: null },
//         displayInput: "list1 = [], list2 = [0]",
//         displayOutput: "[0]",
//       },
//     ],
//     // Note: Linked list input/output requires special handling in runners.
//     // The `runTestCase` functions below assume a utility to convert arrays to lists and lists to arrays.
//     // For simplicity, we'll use placeholder definitions here.
//     startingCode: {
//       javascript: `/**
//  * Definition for singly-linked list.
//  * function ListNode(val, next) {
//  *     this.val = (val===undefined ? 0 : val)
//  *     this.next = (next===undefined ? null : next)
//  * }
//  */
// function mergeTwoLists(list1, list2) {
//     // Your code here
// };

// // Example usage - DO NOT MODIFY THIS (Assumes helper functions arrayToList and listToArray exist)
// function runTestCase(input) {
//     // const l1 = arrayToList(input.list1_arr); // Utility to convert array to ListNode
//     // const l2 = arrayToList(input.list2_arr); // Utility to convert array to ListNode
//     // const mergedList = mergeTwoLists(l1, l2);
//     // return listToArray(mergedList); // Utility to convert ListNode back to array for comparison
//     // Placeholder for demonstration as runners might handle list serialization differently
//     return "Output representation depends on test runner implementation for lists";
// }`,
//       python: `# Definition for singly-linked list.
// # class ListNode:
// #     def __init__(self, val=0, next=None):
// #         self.val = val
// #         self.next = next
// def mergeTwoLists(list1, list2):
//     # Your code here
//     pass

// # Example usage - DO NOT MODIFY THIS (Assumes helper functions arrayToList and listToArray exist)
// def runTestCase(input):
//     # l1 = arrayToList(input["list1_arr"]) # Utility to convert array to ListNode
//     # l2 = arrayToList(input["list2_arr"]) # Utility to convert array to ListNode
//     # mergedList = mergeTwoLists(l1, l2)
//     # return listToArray(mergedList) # Utility to convert ListNode back to array for comparison
//     # Placeholder for demonstration as runners might handle list serialization differently
//     return "Output representation depends on test runner implementation for lists"`,
//       java: `/**
//  * Definition for singly-linked list.
//  * public class ListNode {
//  *     int val;
//  *     ListNode next;
//  *     ListNode() {}
//  *     ListNode(int val) { this.val = val; }
//  *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
//  * }
//  */
// class Solution {
//     public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
//         // Your code here
//         return null;
//     }

//     // Example usage - DO NOT MODIFY THIS (Assumes helper functions arrayToList and listToArray exist)
//     public static Object runTestCase(java.util.Map<String, Object> input) {
//         // ListNode l1 = arrayToList((int[])input.get("list1_arr")); // Utility to convert array to ListNode
//         // ListNode l2 = arrayToList((int[])input.get("list2_arr")); // Utility to convert array to ListNode
//         // ListNode mergedList = new Solution().mergeTwoLists(l1, l2);
//         // return listToArray(mergedList); // Utility to convert ListNode back to array for comparison
//         // Placeholder for demonstration as runners might handle list serialization differently
//         return "Output representation depends on test runner implementation for lists";
//     }
// }`,
//       cpp: `/**
//  * Definition for singly-linked list.
//  * struct ListNode {
//  *     int val;
//  *     ListNode *next;
//  *     ListNode() : val(0), next(nullptr) {}
//  *     ListNode(int x) : val(x), next(nullptr) {}
//  *     ListNode(int x, ListNode *next) : val(x), next(next) {}
//  * };
//  */
// #include <vector>
// #include <map>
// #include <string> // Include necessary header for string
// using namespace std; // Use std namespace

// class Solution {
// public:
//     ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
//         // Your code here
//         return nullptr;
//     }

//     // Example usage - DO NOT MODIFY THIS (Assumes helper functions arrayToList and listToArray exist)
//     static string runTestCase(map<string, void*> input) {
//         // ListNode* l1 = arrayToList(static_cast<vector<int>*>(input["list1_arr"])); // Utility
//         // ListNode* l2 = arrayToList(static_cast<vector<int>*>(input["list2_arr"])); // Utility
//         // ListNode* mergedList = Solution().mergeTwoLists(l1, l2);
//         // return listToArray(mergedList); // Utility returning string representation
//         // Placeholder for demonstration as runners might handle list serialization differently
//         return "Output representation depends on test runner implementation for lists";
//     }
// };`,
//     },
//     sampleSolution: {
//       javascript: `function mergeTwoLists(list1, list2) {
//     if (!list1) return list2;
//     if (!list2) return list1;

//     let head;
//     if (list1.val < list2.val) {
//         head = list1;
//         list1 = list1.next;
//     } else {
//         head = list2;
//         list2 = list2.next;
//     }

//     let current = head;
//     while (list1 && list2) {
//         if (list1.val < list2.val) {
//             current.next = list1;
//             list1 = list1.next;
//         } else {
//             current.next = list2;
//             list2 = list2.next;
//         }
//         current = current.next;
//     }

//     if (list1) {
//         current.next = list1;
//     } else if (list2) {
//         current.next = list2;
//     }

//     return head;
// };`,
//       python: `def mergeTwoLists(list1, list2):
//     if not list1:
//         return list2
//     if not list2:
//         return list1

//     if list1.val < list2.val:
//         head = list1
//         list1 = list1.next
//     else:
//         head = list2
//         list2 = list2.next
    
//     current = head
//     while list1 and list2:
//         if list1.val < list2.val:
//             current.next = list1
//             list1 = list1.next
//         else:
//             current.next = list2
//             list2 = list2.next
//         current = current.next
        
//     if list1:
//         current.next = list1
//     elif list2:
//         current.next = list2
        
//     return head`,
//     },
//     tags: ["Linked List", "Recursion"],
//     problemType: "Linked List",
//     solutionHint:
//       "Iteratively compare nodes from both lists and append the smaller one to the result list. Alternatively, use recursion.",
//   },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium", // Updated from Easy in interview page
    description:
      "Find the contiguous subarray within an array (containing at least one number) which has the largest sum.",
    fullDescription: `
# Maximum Subarray

## Problem Statement
Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return *its sum*.
A **subarray** is a **contiguous** part of an array.

## Examples
Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.

## Constraints
- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`

## Follow-up
If you have figured out the O(n) solution, try coding another solution using the **divide and conquer** approach, which is more subtle.
    `,
    testCases: [
      {
        input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
        output: 6,
        displayInput: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        displayOutput: "6",
      },
      {
        input: { nums: [1] },
        output: 1,
        displayInput: "nums = [1]",
        displayOutput: "1",
      },
      {
        input: { nums: [5, 4, -1, 7, 8] },
        output: 23,
        displayInput: "nums = [5,4,-1,7,8]",
        displayOutput: "23",
      },
      {
        input: { nums: [-1] },
        output: -1,
        displayInput: "nums = [-1]",
        displayOutput: "-1",
      },
      {
        input: { nums: [-2, -1] },
        output: -1,
        displayInput: "nums = [-2, -1]",
        displayOutput: "-1",
      },
    ],
    startingCode: {
      javascript: `function maxSubArray(nums) {
    // Your code here
};

// Example usage - DO NOT MODIFY THIS
function runTestCase(input) {
    return maxSubArray(input.nums);
}`,
      python: `def maxSubArray(nums):
    # Your code here
    pass

# Example usage - DO NOT MODIFY THIS
def runTestCase(input):
    return maxSubArray(input["nums"])`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here
        return 0;
    }

    // Example usage - DO NOT MODIFY THIS
    public static int runTestCase(java.util.Map<String, Object> input) {
        int[] nums = (int[])input.get("nums");
        return new Solution().maxSubArray(nums);
    }
}`,
      cpp: `#include <vector>
#include <map>
#include <string> // Include necessary header
#include <limits> // Include for numeric_limits
#include <algorithm> // Include for max
using namespace std; // Use std namespace

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Your code here
        return 0;
    }

    // Example usage - DO NOT MODIFY THIS
    static int runTestCase(map<string, void*> input) {
        vector<int>* nums = static_cast<vector<int>*>(input["nums"]);
        return Solution().maxSubArray(*nums);
    }
};`,
    },
    sampleSolution: {
      javascript: `function maxSubArray(nums) {
    let maxSoFar = -Infinity;
    let maxEndingHere = 0;

    for (let i = 0; i < nums.length; i++) {
        maxEndingHere = maxEndingHere + nums[i];
        if (maxSoFar < maxEndingHere) {
            maxSoFar = maxEndingHere;
        }
        if (maxEndingHere < 0) {
            maxEndingHere = 0;
        }
    }
    // Handle case where all numbers are negative
     if (maxSoFar === -Infinity) {
        maxSoFar = nums[0];
        for (let i = 1; i < nums.length; i++) {
            maxSoFar = Math.max(maxSoFar, nums[i]);
        }
    } else if (nums.length > 0 && maxSoFar < 0) {
         // Check if the largest single element is greater than maxSoFar if maxSoFar is negative
        let largestSingle = nums[0];
        for (let i = 1; i < nums.length; i++) {
            largestSingle = Math.max(largestSingle, nums[i]);
        }
         maxSoFar = Math.max(maxSoFar, largestSingle)
    }


    return maxSoFar;
};`,
      python: `import math

def maxSubArray(nums):
    max_so_far = -math.inf
    max_ending_here = 0
    
    for x in nums:
        max_ending_here = max_ending_here + x
        if max_so_far < max_ending_here:
            max_so_far = max_ending_here
        if max_ending_here < 0:
            max_ending_here = 0
            
    # If all numbers are negative, max_so_far might remain -inf or 0 if initialized to 0.
    # Kadane's algorithm as described often needs adjustment for all-negative arrays.
    # A simple fix is to return the max element if max_so_far is still the initial negative infinity,
    # or handle it by ensuring max_so_far tracks the largest single element if all sums are negative.
    if not nums:
        return 0 # Or raise error based on constraints
    
    # Correct handling for all negative numbers:
    current_max = nums[0]
    global_max = nums[0]
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        if current_max > global_max:
            global_max = current_max
            
    return global_max
`,
    },
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"], // Added Divide and Conquer
    problemType: "Dynamic Programming",
    solutionHint:
      "Use Kadane's algorithm: keep track of the maximum sum ending at the current position and the overall maximum sum found so far.",
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    fullDescription: `
# Longest Palindromic Substring

## Problem Statement
Given a string \`s\`, return the longest palindromic substring in \`s\`.
A string is **palindromic** if it reads the same forward and backward.
A **substring** is a contiguous sequence of characters within the string.

## Examples
Example 1:
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Example 2:
Input: s = "cbbd"
Output: "bb"

## Constraints
- \`1 <= s.length <= 1000\`
- \`s\` consist of only digits and English letters.
    `,
    testCases: [
      {
        input: { s: "babad" },
        output: ["bab", "aba"], // Accept multiple valid outputs
        displayInput: 's = "babad"',
        displayOutput: '"bab" or "aba"',
      },
      {
        input: { s: "cbbd" },
        output: ["bb"],
        displayInput: 's = "cbbd"',
        displayOutput: '"bb"',
      },
      {
        input: { s: "a" },
        output: ["a"],
        displayInput: 's = "a"',
        displayOutput: '"a"',
      },
      {
        input: { s: "ac" },
        output: ["a", "c"],
        displayInput: 's = "ac"',
        displayOutput: '"a" or "c"',
      },
      {
        input: { s: "racecar" },
        output: ["racecar"],
        displayInput: 's = "racecar"',
        displayOutput: '"racecar"',
      },
    ],
    startingCode: {
      javascript: `function longestPalindrome(s) {
    // Your code here
};

// Example usage - DO NOT MODIFY THIS
function runTestCase(input) {
    return longestPalindrome(input.s);
}`,
      python: `def longestPalindrome(s):
    # Your code here
    pass

# Example usage - DO NOT MODIFY THIS
def runTestCase(input):
    return longestPalindrome(input["s"])`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        // Your code here
        return "";
    }

    // Example usage - DO NOT MODIFY THIS
    public static String runTestCase(java.util.Map<String, Object> input) {
        String s = (String)input.get("s");
        return new Solution().longestPalindrome(s);
    }
}`,
      cpp: `#include <string>
#include <vector>
#include <map>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        // Your code here
        return "";
    }

    // Example usage - DO NOT MODIFY THIS
    static string runTestCase(map<string, void*> input) {
        string* s = static_cast<string*>(input["s"]);
        return Solution().longestPalindrome(*s);
    }
};`,
    },
    sampleSolution: {
      javascript: `function longestPalindrome(s) {
    if (!s || s.length < 1) return "";
    
    let start = 0;
    let end = 0;

    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            if (right - left + 1 > end - start) {
                start = left;
                end = right + 1; // end is exclusive for slice
            }
            left--;
            right++;
        }
    }

    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i);     // Odd length palindromes
        expandAroundCenter(i, i + 1); // Even length palindromes
    }

    return s.substring(start, end);
};`,
      python: `def longestPalindrome(s):
    if not s:
        return ""
    
    n = len(s)
    start, max_len = 0, 1

    # Helper function to expand around center
    def expand_around_center(left, right):
        nonlocal start, max_len
        while left >= 0 and right < n and s[left] == s[right]:
            if right - left + 1 > max_len:
                max_len = right - left + 1
                start = left
            left -= 1
            right += 1

    for i in range(n):
        # Odd length palindromes
        expand_around_center(i, i)
        # Even length palindromes
        expand_around_center(i, i + 1)
        
    return s[start:start + max_len]
`,
    },
    tags: ["String", "Dynamic Programming", "Two Pointers"], // Added Two Pointers
    problemType: "Dynamic Programming",
    solutionHint:
      "Expand around the center for each character (and between characters) to find the longest palindrome efficiently.",
  },
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
  actionButton,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-fit overflow-hidden shadow-xl transform"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <div className="mt-4">{children}</div>
          <div className="mt-6 flex justify-end space-x-3">
            {actionButton}
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Function to check if a string is a valid MongoDB ObjectId format
function isValidObjectId(id: string | null): boolean {
  if (!id) return false;
  // MongoDB ObjectIds are 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Interface for AI generated test cases
interface AITestCase {
  input: any;
  expectedOutput: any;
  purpose: string;
  difficulty: string;
  performanceTest: boolean;
}

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
  const [completionTime, setCompletionTime] = useState<number>(0);
  // New states for AI test case generation
  const [isGeneratingTestCases, setIsGeneratingTestCases] =
    useState<boolean>(false);
  const [aiTestCases, setAiTestCases] = useState<AITestCase[]>([]);
  const [isTestCaseModalOpen, setIsTestCaseModalOpen] =
    useState<boolean>(false);
  const [selectedTestCase, setSelectedTestCase] = useState<AITestCase | null>(
    null,
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Create Judge0 client
  const judge0Client = createJudge0Client();

  // Access the solution store
  const setSolutionData = useSolutionStore((state) => state.setSolutionData);

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

  // Extract runTestCase function from the code
  const extractRunTestCase = (code: string): string => {
    // Using a more compatible regex without the 's' flag
    const runTestCaseRegex =
      /\/\/ Example usage[\s\S]*?function runTestCase\([\s\S]*?\)[\s\S]*?\{[\s\S]*?\}|# Example usage[\s\S]*?def runTestCase\([\s\S]*?\):[\s\S]*?(?=\n\n|$)|\/\/ Example usage[\s\S]*?static[\s\S]*?runTestCase\([\s\S]*?\)[\s\S]*?\{[\s\S]*?\}/;
    const match = code.match(runTestCaseRegex);
    return match ? match[0] : "";
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
      const wrapperCode = generateWrapperCode(
        code,
        selectedLanguage,
        question.testCases,
      );

      // Execute code using Judge0
      const result = await judge0Client.executeCode(
        wrapperCode,
        selectedLanguage,
        "", // No stdin needed as inputs are in the wrapper code
        true,
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
  const generateWrapperCode = (
    userCode: string,
    language: string,
    testCases: any[],
  ) => {
    switch (language) {
      case "javascript":
        return `
${userCode}

// Test runner
function runTests() {
  const testCases = ${JSON.stringify(testCases.map((tc) => tc.input))};
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
      case "python":
        return `
${userCode}

# Test runner
import json

def run_tests():
    test_cases = ${JSON.stringify(testCases.map((tc) => tc.input))}
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
        displayInput: customTestCase,
      };

      const wrapperCode = generateWrapperCode(code, selectedLanguage, [
        singleTestCase,
      ]);

      // Check if we have RapidAPI key
      const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

      if (!rapidApiKey) {
        // Fallback to mock execution if no API key
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
        true,
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
    if (result.status.id !== 3) { // 3 = Accepted
      setOutput(`Execution Error: ${result.status.description}\\n${result.message || ""}`);
      return;
    }

    // Parse the results from stdout
    try {
      const output = result.stdout || "[]";
      const testResults = JSON.parse(output); // Array of {input, output, error}

      // Function to check if a single test case passed
      const checkTestCase = (testResult: any, expectedOutput: any, questionId: number): boolean => {
        if (testResult.error) return false; // Runtime error for this specific case

        // Special handling for Longest Palindromic Substring (ID 5)
        if (questionId === 5 && Array.isArray(expectedOutput)) {
          // Check if the actual output string is one of the valid expected strings
          return expectedOutput.includes(testResult.output);
        }

        // Default comparison for other questions
        return JSON.stringify(testResult.output) === JSON.stringify(expectedOutput);
      };

      // Format test case results and check overall success
      let allPassed = true;
      const testCaseResults = question?.testCases
        .map((tc, idx) => {
          const testResult = testResults[idx];
          if (!testResult) {
            allPassed = false;
            return `Test Case ${idx + 1}: Error - Missing result data`;
          }

          const passed = checkTestCase(testResult, tc.output, question.id);
          if (!passed) {
            allPassed = false;
          }

          return `Test Case ${idx + 1}:
Input: ${tc.displayInput}
Expected: ${tc.displayOutput}
Your output: ${JSON.stringify(testResult.output)}
${testResult.error ? `Runtime Error: ${testResult.error}` : ""}
Status: ${passed ? "✅ Passed" : "❌ Failed"}`;
        })
        .join("\n\n");

      setOutput(`Test Results:\n\n${testCaseResults}`);

      // Check if all test cases passed (now uses the updated `allPassed` flag)
      console.log("Test run results:", testCaseResults);
      console.log("All passed:", allPassed);

      // --- Success Modal Logic ---
      // NOTE: The original logic for showing the success modal *only on runCode*
      // might be debatable. Usually, `runCode` just shows results, and only `handleSubmit`
      // triggers the "Challenge Completed" state. I'll keep the original logic for now,
      // but consider moving this success block entirely to `processSubmissionResult`.
      if (allPassed) {
        const completionTime = 30 * 60 - timeLeft;
        setCompletionTime(completionTime);
        // saveSubmissionToDatabase(completionTime); // Typically only save on explicit submit
        setIsSuccessModalOpen(true); // Show success on run if all pass
        triggerSuccessConfetti();
      }
      // --- End Success Modal Logic ---

    } catch (error) {
      console.error("Error parsing test results:", error);
      setOutput(`Error parsing test results: ${error instanceof Error ? error.message : "Unknown error"}\\n\\nRaw output: ${result.stdout}`);
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
      const testResults = JSON.parse(output); // Should be an array with one result

      if (testResults.length > 0) {
        const testResult = testResults[0];

        // We don't have an "expected" output for custom tests, just display the result.
        const formattedResult = `Custom Test Case Result:
Input: ${JSON.stringify(input)}
Output: ${JSON.stringify(testResult.output)}
${testResult.error ? `Runtime Error: ${testResult.error}` : ""}
Execution Time: ${result.time || "N/A"}s
Memory Used: ${result.memory || "N/A"} KB`;

        setOutput(formattedResult);
      } else {
        setOutput("No results returned from custom test execution.");
      }
    } catch (error) {
      console.error("Error parsing custom test result:", error);
      setOutput(`Error parsing custom test results: ${error instanceof Error ? error.message : "Unknown error"}\\n\\nRaw output: ${result.stdout}`);
    }
  };

  // Fallback mock execution
  const mockExecution = async () => {
    if (!question) return;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Function to check if a single test case passed (mirrors logic from processJudge0Result)
    const checkTestCaseMock = (actualOutput: any, expectedOutput: any, questionId: number): boolean => {
       // Special handling for Longest Palindromic Substring (ID 5)
       if (questionId === 5 && Array.isArray(expectedOutput)) {
         return expectedOutput.includes(actualOutput);
       }
       // Default comparison
       return JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
    };

    // Mock output with proper test case format
    let allPassedMock = true;
    const mockTestResultsData = question.testCases.map((tc, idx) => {
        // Simulate success/failure more realistically based on comparison
        const shouldPass = Math.random() > 0.3; // 70% chance raw success
        let mockOutput;
        if (shouldPass) {
            // If it should pass, generate a valid output (handle array case for Q5)
            if (question.id === 5 && Array.isArray(tc.output)) {
                mockOutput = tc.output[0]; // Pick the first valid answer
            } else {
                mockOutput = tc.output;
            }
        } else {
            // Simulate incorrect output
             mockOutput = idx % 2 === 0 ? (typeof tc.output === 'string' ? "wrong" : []) : (typeof tc.output === 'number' ? 999 : [1,0]);
        }

        const passed = checkTestCaseMock(mockOutput, tc.output, question.id);
        if (!passed) {
           allPassedMock = false;
        }
        return {
           input: tc.input,
           expected: tc.output,
           output: mockOutput, // Use the generated mock output
           passed: passed, // Determine passed status based on comparison
        };
    });


    const formattedResults = mockTestResultsData
      .map(
        (result, idx) =>
          `Test Case ${idx + 1}:
Input: ${question.testCases[idx].displayInput}
Expected: ${question.testCases[idx].displayOutput}
Your output: ${JSON.stringify(result.output)}
Status: ${result.passed ? "✅ Passed" : "❌ Failed"}`,
      )
      .join("\\n\\n");

    setOutput(`Test Results:\\n\\n${formattedResults}`);
    console.log("Mock execution results:", formattedResults);
    console.log("Mock All passed:", allPassedMock);


    // Only show success modal if all test cases pass (using the accurate mock pass status)
    if (allPassedMock) {
      const completionTime = 30 * 60 - timeLeft;
      setCompletionTime(completionTime);
      // saveSubmissionToDatabase(completionTime); // Typically only save on explicit submit
      setIsSuccessModalOpen(true);
      triggerSuccessConfetti();
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
        await mockSubmission(); // Call mock submission if no API key
        return;
      }

      // --- Real Submission Logic ---
      const wrapperCode = generateWrapperCode(
        code,
        selectedLanguage,
        question.testCases,
      );

      const result = await judge0Client.executeCode(
        wrapperCode,
        selectedLanguage,
        "", // No stdin needed
        true, // Wait for result
      );

      processSubmissionResult(result); // Process the result of the submission
      // --- End Real Submission Logic ---

    } catch (error) {
      console.error("Error submitting code:", error);
      setOutput(
        `Error submitting your solution: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modified to also trigger confetti and save to database
  const processSubmissionResult = (result: SubmissionResult) => {
    // ... (compilation/runtime error checks remain the same)

    if (result.status.id !== 3) { // 3 = Accepted
      setOutput(`Execution Error: ${result.status.description}\\n${result.message || ""}`);
      return;
    }

    try {
      const output = result.stdout || "[]";
      const testResults = JSON.parse(output); // Array of {input, output, error}

      // Function to check if a single test case passed (same as in processJudge0Result)
      const checkTestCase = (testResult: any, expectedOutput: any, questionId: number): boolean => {
        if (testResult.error) return false;
        if (questionId === 5 && Array.isArray(expectedOutput)) {
          return expectedOutput.includes(testResult.output);
        }
        return JSON.stringify(testResult.output) === JSON.stringify(expectedOutput);
      };

      // Format test case results and check overall success
      let allPassed = true;
      const testCaseResults = question?.testCases
        .map((tc, idx) => {
          const testResult = testResults[idx];
           if (!testResult) {
            allPassed = false;
            return `Test Case ${idx + 1}: Error - Missing result data`;
          }

          const passed = checkTestCase(testResult, tc.output, question.id);
          if (!passed) {
            allPassed = false;
          }

          return `Test Case ${idx + 1}:
Input: ${tc.displayInput}
Expected: ${tc.displayOutput}
Your output: ${JSON.stringify(testResult.output)}
${testResult.error ? `Runtime Error: ${testResult.error}` : ""}
Status: ${passed ? "✅ Passed" : "❌ Failed"}`;
        })
        .join("\\n\\n");

      setOutput(
        `Submission Results:\\n\\n${testCaseResults}\\n\\nExecution Time: ${result.time || 'N/A'}s\\nMemory Used: ${result.memory || 'N/A'} KB`,
      );

      console.log("Submission results:", testCaseResults);
      console.log("All passed on submission:", allPassed);

      if (allPassed) {
        const completionTime = 30 * 60 - timeLeft;
        setCompletionTime(completionTime);
        saveSubmissionToDatabase(completionTime); // Save to DB on successful submit
        setIsSuccessModalOpen(true);
        triggerSuccessConfetti();
        if (timerRef.current) {
          clearTimeout(timerRef.current); // Stop timer on success
        }
      }
    } catch (error) {
      console.error("Error parsing submission results:", error);
      setOutput(`Error parsing submission results: ${error instanceof Error ? error.message : "Unknown error"}\\n\\nRaw output: ${result.stdout}`);
    }
  };

   // Mock submission
   const mockSubmission = async () => {
    if (!question) return;

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    // Function to check if a single test case passed (mirrors logic)
    const checkTestCaseMock = (actualOutput: any, expectedOutput: any, questionId: number): boolean => {
       if (questionId === 5 && Array.isArray(expectedOutput)) {
         return expectedOutput.includes(actualOutput);
       }
       return JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
    };

    // Simulate success rate for the whole submission
    const overallSuccess = Math.random() > 0.3; // 70% chance the submission is globally correct

    let allPassedMock = true;
    const mockTestResultsData = question.testCases.map((tc, idx) => {
        // If overall submission is meant to succeed, make all tests pass correctly
        // Otherwise, simulate some failures based on individual chance
        const shouldThisTestPass = overallSuccess || Math.random() > 0.3;
        let mockOutput;

        if (shouldThisTestPass) {
             if (question.id === 5 && Array.isArray(tc.output)) {
                mockOutput = tc.output[0]; // Correct output for Q5
            } else {
                mockOutput = tc.output; // Correct output for others
            }
        } else {
             // Simulate incorrect output if this test should fail
             mockOutput = idx % 2 === 0 ? (typeof tc.output === 'string' ? "wrong" : []) : (typeof tc.output === 'number' ? 999 : [1,0]);
             allPassedMock = false; // Mark overall as failed if any test fails
        }

         // Double-check pass status using the comparison logic, though it should align with shouldThisTestPass if logic is right
        const passed = checkTestCaseMock(mockOutput, tc.output, question.id);
         if (!passed) allPassedMock = false; // Ensure allPassedMock reflects actual comparison result


        return {
           input: tc.input,
           expected: tc.output,
           output: mockOutput,
           passed: passed,
        };
    });


    const formattedResults = mockTestResultsData
      .map(
        (result, idx) =>
          `Test Case ${idx + 1}:
Input: ${question.testCases[idx].displayInput}
Expected: ${question.testCases[idx].displayOutput}
Your output: ${JSON.stringify(result.output)}
Status: ${result.passed ? "✅ Passed" : "❌ Failed"}`,
      )
      .join("\\n\\n");

    setOutput(`Submission Results:\\n\\n${formattedResults}`);
    console.log("Mock Submission results:", formattedResults);
    console.log("Mock All passed on submission:", allPassedMock);


    if (allPassedMock) {
      const completionTime = 30 * 60 - timeLeft;
      setCompletionTime(completionTime);
      saveSubmissionToDatabase(completionTime); // Save on mock successful submit
      setIsSuccessModalOpen(true);
      triggerSuccessConfetti();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };

  // Function to save submission to the database
  const saveSubmissionToDatabase = async (completionTime: number) => {
    console.log("Saving Submission to database...");
    if (!question) return;

    try {
      // Get the interview ID from local storage or query params
      // This assumes you're storing the current interview ID when navigating to this page
      let interviewId;

      // Try to get interviewId from localStorage
      if (typeof window !== "undefined") {
        interviewId = localStorage.getItem("currentInterviewId");
      }

      // If interviewId is not in localStorage, check URL search params
      if (!interviewId && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        interviewId = urlParams.get("interviewId");
      }

      // If still no interviewId, we can't proceed
      if (!interviewId || !isValidObjectId(interviewId)) {
        console.error("No valid interview ID found - cannot save results");
        return;
      }

      console.log("Using interview ID:", interviewId);

      // First, fetch the current interview to get existing questions
      interface InterviewResponse {
        success: boolean;
        data: {
          _id: string;
          questions?: Array<{
            question: string;
            answer?: string;
            code?: string; // Add code field to store the solution code
            language?: string; // Add language field to store the programming language
            score?: number;
            questionId?: number; // Add questionId to track unique questions
            timeTaken?: number; // Add timeTaken to track completion time per question
          }>;
          [key: string]: any; // For other fields we don't need here
        };
      }

      const currentInterviewResponse = await apiGet<InterviewResponse>(
        `/api/interviews/${interviewId}`,
      );
      if (!currentInterviewResponse.success) {
        throw new Error("Failed to fetch current interview");
      }

      // Get existing questions or initialize empty array
      const existingQuestions = currentInterviewResponse.data.questions || [];

      // Format completion time for display
      const formattedTime = formatTime(completionTime);

      // Create new question object
      const newQuestion = {
        question: question.title,
        answer: code,
        code: code, // Store full solution code
        language: selectedLanguage, // Store the language used
        score: 10, // Assuming a perfect score for passing all test cases
        questionId: question.id, // Store the question ID to track duplicates
        timeTaken: completionTime, // Store the time taken to complete the question
      };

      // Check if this question already exists in the array
      const questionIndex = existingQuestions.findIndex(
        (q) => q.questionId === question.id || q.question === question.title,
      );

      let updatedQuestions;

      if (questionIndex >= 0) {
        // Question already exists, update it
        console.log(`Question "${question.title}" already exists, updating it`);
        updatedQuestions = [...existingQuestions];
        updatedQuestions[questionIndex] = newQuestion;
      } else {
        // Question doesn't exist, append it
        console.log(`Adding new question "${question.title}"`);
        updatedQuestions = [...existingQuestions, newQuestion];
      }

      // Call the API to update the interview record
      // Also update the status to "completed" since the user has successfully completed a question
      const response = await apiPut<InterviewResponse>(
        `/api/interviews/${interviewId}`,
        {
          status: "completed",
          questions: updatedQuestions,
          feedback: `Successfully completed ${question.title} in ${formattedTime}.`,
        },
      );

      console.log("Submission saved successfully:", response);

      // Store interviewId and lastCompletedQuestion for next page
      if (typeof window !== "undefined") {
        localStorage.setItem("lastCompletedQuestion", question.title);
        // Make sure currentInterviewId is set for the return journey
        localStorage.setItem("currentInterviewId", interviewId);
      }
    } catch (error) {
      console.error("Error saving submission to database:", error);
      // Don't show an error to the user here since the submission was technically successful
      // This is just for database persistence
    }
  };

  // Trigger confetti animation
  const triggerSuccessConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 5000,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // Helper function to show sample solution
  const showSampleSolution = () => {
    if (
      question?.sampleSolution &&
      question.sampleSolution[
        selectedLanguage as keyof typeof question.sampleSolution
      ]
    ) {
      const solutionCode =
        question.sampleSolution[
          selectedLanguage as keyof typeof question.sampleSolution
        ];
      const currentCode = code;
      const runTestCasePart = extractRunTestCase(currentCode);

      // Merge the solution with the runTestCase function
      if (runTestCasePart) {
        setCode(solutionCode + "\n\n" + runTestCasePart);
      } else {
        setCode(solutionCode);
      }
    } else {
      setOutput("No sample solution available for the selected language.");
    }
  };

  // Generate AI test cases
  const generateAITestCases = async () => {
    if (!question) return;

    setIsGeneratingTestCases(true);
    setOutput("Generating AI test cases...");

    try {
      // Get interviewId if available
      let interviewId;
      if (typeof window !== "undefined") {
        interviewId = localStorage.getItem("currentInterviewId");
        if (!interviewId) {
          const urlParams = new URLSearchParams(window.location.search);
          interviewId = urlParams.get("interviewId");
        }
      }

      // Prepare data for API call
      const payload = {
        problemStatement: question.fullDescription,
        constraints: question.testCases,
        solutionHint: question.solutionHint,
        problemId: question.id,
        interviewId: interviewId || undefined,
        questionId: question.id,
      };

      // Call API to generate test cases
      const response = await apiPost<{
        success: boolean;
        message: string;
        data: {
          testCases: AITestCase[];
          testCasesText: string;
          fromCache: boolean;
        };
      }>("/api/ai/generate-test-cases", payload);

      if (response.success && response.data.testCases) {
        setAiTestCases(response.data.testCases);
        setIsTestCaseModalOpen(true);

        // Add explanation to output
        setOutput(
          `AI Test Cases Generated Successfully!\n\n${response.data.testCasesText}`,
        );
      } else {
        setOutput("Failed to generate AI test cases. Please try again.");
      }
    } catch (error) {
      console.error("Error generating AI test cases:", error);
      setOutput(
        `Error generating AI test cases: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsGeneratingTestCases(false);
    }
  };

  // Apply selected test case to input field
  const applySelectedTestCase = () => {
    if (selectedTestCase) {
      setCustomTestCase(JSON.stringify(selectedTestCase.input, null, 2));
      setIsTestCaseModalOpen(false);
    }
  };

  if (!question) {
    return <div className="p-8">Question not found!</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center z-50">
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
        <div className="flex items-center z-50">
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
      <div className="flex-1 overflow-hidden flex">
        <PanelGroup direction="horizontal" className="w-full h-full">
          {/* Problem Description Panel - Left Side */}
          <Panel defaultSize={40} minSize={30}>
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

          {/* Right Side Panel Group */}
          <Panel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col">
              <PanelGroup direction="vertical" className="h-full">
                {/* Code Editor Panel - Top Right */}
                <Panel defaultSize={70} minSize={40}>
                  <div className="h-full flex flex-col">
                    <div className="px-4 py-2 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Code Editor
                      </span>
                      <div className="ml-auto flex items-center space-x-2 z-50">
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
                    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-950 flex flex-col">
                      {/* Warning banner for protected code */}
                      <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900 border-b border-amber-200 dark:border-amber-800 flex items-center flex-shrink-0">
                        <Lock className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs text-amber-800 dark:text-amber-200">
                          Please do not modify the &quot;Example usage&quot;
                          section. It is required for test case evaluation.
                        </span>
                      </div>
                      <div className="p-4 flex-1 overflow-hidden flex flex-col">
                        <CodeEditor
                          value={code}
                          onChange={setCode}
                          language={selectedLanguage}
                          placeholder="Write your code here..."
                          className="w-full h-full min-h-0 flex-1"
                          style={{ height: "100%", minHeight: "300px" }}
                        />
                      </div>
                    </div>
                  </div>
                </Panel>

                {/* Vertical Resize Handle */}
                <PanelResizeHandle className="h-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors" />

                {/* Output Panel - Bottom Right */}
                <Panel defaultSize={30} minSize={20}>
                  <div className="h-full flex flex-col">
                    <div className="px-4 py-2 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
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
                          disabled={
                            isRunning || isSubmitting || !customTestCase
                          }
                          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Run Custom Test
                        </button>
                        {/* Add AI test case generation button */}
                        <button
                          onClick={generateAITestCases}
                          disabled={
                            isGeneratingTestCases || isRunning || isSubmitting
                          }
                          className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <Wand2 className="w-3 h-3 mr-1" />
                          {isGeneratingTestCases
                            ? "Generating..."
                            : "AI Test Cases"}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto p-4 bg-gray-900 text-green-400 font-mono text-sm whitespace-pre">
                      {output || "Run your code to see the output..."}
                    </div>
                  </div>
                </Panel>
              </PanelGroup>
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

      {/* Success Modal - Redesigned */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Challenge Completed! 🎉"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
          </div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Excellent work!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300 mb-4"
          >
            You&apos;ve successfully completed the {question.title} challenge.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Time taken:
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {formatTime(completionTime)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500 dark:text-gray-400">
                Difficulty:
              </span>
              <span
                className={`font-medium ${
                  question.difficulty === "Easy"
                    ? "text-green-600"
                    : question.difficulty === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {question.difficulty}
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-center space-x-4"
          >
            <button
              onClick={() => {
                // Get the interviewId from localStorage or URL params
                let interviewId;
                if (typeof window !== "undefined") {
                  interviewId = localStorage.getItem("currentInterviewId");
                  if (!interviewId) {
                    const urlParams = new URLSearchParams(
                      window.location.search,
                    );
                    interviewId = urlParams.get("interviewId");
                  }
                }

                // Navigate to the interview detail page using the correct ID
                if (interviewId) {
                  router.push(`/interview/${interviewId}`);
                } else {
                  // Fallback to interviews list if no ID found
                  router.push("/interview");
                }
              }}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer"
            >
              Return to Challenges
            </button>
            <button
              onClick={() => {
                // Navigate to code review page with question id and interview id
                let interviewId;
                if (typeof window !== "undefined") {
                  interviewId = localStorage.getItem("currentInterviewId");
                  if (!interviewId) {
                    const urlParams = new URLSearchParams(
                      window.location.search,
                    );
                    interviewId = urlParams.get("interviewId");
                  }

                  // Only proceed with valid ObjectId
                  if (!isValidObjectId(interviewId)) {
                    console.warn(
                      "Invalid interview ID for code review:",
                      interviewId,
                    );
                    alert(
                      "Cannot access code review: Invalid interview ID. Please start a new interview session.",
                    );
                    return;
                  }

                  // Save solution data to Zustand store
                  setSolutionData({
                    code,
                    language: selectedLanguage,
                    problemStatement: question?.fullDescription || "",
                    questionTitle: question?.title || "",
                    questionId: question?.id.toString() || "",
                    problemType: question?.problemType || "",
                    solutionHint: question?.solutionHint || "",
                  });
                }

                // Navigate to code review page
                router.push(
                  `/interview/code-review/${question.id}?interviewId=${interviewId || ""}`,
                );
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Code Review
            </button>
            {question && question.id < codingQuestions.length && (
              <button
                onClick={() => {
                  // Get interviewId before navigating to next question
                  let interviewId;
                  if (typeof window !== "undefined") {
                    interviewId = localStorage.getItem("currentInterviewId");
                    if (!interviewId) {
                      const urlParams = new URLSearchParams(
                        window.location.search,
                      );
                      interviewId = urlParams.get("interviewId");
                    }

                    // Navigate to next question with interviewId
                    router.push(
                      `/interview/question/${question.id + 1}?interviewId=${interviewId}`,
                    );
                  } else {
                    router.push(`/interview/question/${question.id + 1}`);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer"
              >
                Next Challenge
              </button>
            )}
          </motion.div>
        </div>
      </Modal>

      {/* AI Test Cases Modal */}
      <Modal
        isOpen={isTestCaseModalOpen}
        onClose={() => setIsTestCaseModalOpen(false)}
        title="AI Generated Test Cases"
        actionButton={
          <button
            onClick={applySelectedTestCase}
            disabled={!selectedTestCase}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Selected Test Case
          </button>
        }
      >
        <div className="max-h-96 overflow-y-auto">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select a test case to use:
          </p>
          <div className="space-y-4">
            {aiTestCases.map((testCase, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTestCase === testCase
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
                onClick={() => setSelectedTestCase(testCase)}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Test Case {index + 1}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      testCase.difficulty === "easy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : testCase.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : testCase.difficulty === "hard"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}
                  >
                    {testCase.difficulty.charAt(0).toUpperCase() +
                      testCase.difficulty.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {testCase.purpose}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Input:
                    </div>
                    <div className="font-mono text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-auto max-h-24">
                      {JSON.stringify(testCase.input, null, 2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Expected Output:
                    </div>
                    <div className="font-mono text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-auto max-h-24">
                      {JSON.stringify(testCase.expectedOutput, null, 2)}
                    </div>
                  </div>
                </div>
                {testCase.performanceTest && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    ⚡ Performance Test
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CodeQuestion;
