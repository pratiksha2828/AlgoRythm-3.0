import './app.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { parseInputString } from './utils/parseInputString.js';
import { generateJavaScriptHarness } from './utils/generateJavaScriptHarness.js';
import { generatePythonHarness } from './utils/generatePythonHarness.js';

// Configuration Constants - Centralized for easy maintenance
const CONFIG = {
  // API Endpoints
  OLLAMA_ENDPOINT: import.meta.env.VITE_OLLAMA_ENDPOINT || 'http://localhost:11434',
  PISTON_API_ENDPOINT: import.meta.env.VITE_PISTON_API_ENDPOINT || 'https://emkc.org/api/v2/piston/execute',
  
  // Time limits (in seconds)
  TEST_DURATION: 3600, // 60 minutes
  
  // Optimization thresholds
  OPTIMIZATION_THRESHOLDS: {
    EXCELLENT: 20,      // 0-20%: Excellent
    GOOD: 50,           // 21-50%: Good
    NEEDS_WORK: 80,     // 51-80%: Needs significant optimization
    CRITICAL: 100       // 81-100%: Major optimization required
  },
  
  // Pattern suggestion percentages
  PATTERN_SUGGESTIONS: {
    HASHMAP_SUBOPTIMAL: 25,     // HashMap when Boyer-Moore is better
    QUADRATIC_SORT: 40,          // Bubble/insertion/selection sort
    FIBONACCI_NO_MEMO: 75,       // Recursive Fibonacci without memoization
  },
  
  // AI analysis settings
  AI_SETTINGS: {
    OPTIMAL_ALGORITHM_CAP: 5,    // Max % for optimal algorithms (0-5% for truly optimal code)
    SUGGESTION_THRESHOLD: 0.6,    // Only suggest if AI < 60% of pattern suggestion
    TEMPERATURE: 0.1,
    TOP_P: 0.9,
    DEFAULT_FALLBACK_PERCENTAGE: 50  // Default when AI fails
  }
};

/**
 * OPTIMIZATION ANALYSIS ARCHITECTURE
 * 
 * This file uses a dual-method approach for code optimization analysis:
 * 
 * 1. PRIMARY METHOD - AI-Based Analysis (analyzeWithMistral):
 *    - Uses Ollama/Mistral AI for comprehensive code analysis
 *    - Detects optimal algorithms (Boyer-Moore, Binary Search, etc.)
 *    - Provides accurate optimization percentages (0-100%)
 *    - Returns detailed feedback, suggestions, and code examples
 *    - Called via: analyzeOptimization() or getAIOptimizationPercentage()
 * 
 * 2. FALLBACK METHOD - Complexity-Based Estimation:
 *    - Used when AI is unavailable (Ollama not running, network issues)
 *    - Simple heuristic based on code metrics (lines, loops, conditionals)
 *    - Less accurate but always available
 *    - Used in: evaluateAgainstTestCases() and analyzeWithMistral() catch block
 * 
 * DISPLAY PRIORITY (see displayedRefactoringPercentage):
 *    1. AI optimization percentage (if available)
 *    2. Optimization result from analyzeOptimization
 *    3. Submission result from submitCode
 *    4. Default: 0%
 * 
 * RECOMMENDATION: Always use AI-based analysis for accurate results.
 * The complexity-based fallback is intentionally simple and serves as a last resort.
 */

// Utility Functions - Extract common logic for reusability

/**
 * Creates the standardized AI optimization prompt
 * @param {string} userCode - The code to analyze
 * @param {string} language - Programming language
 * @param {string} problem - Problem description
 * @returns {string} - Formatted prompt for AI
 */
const createOptimizationPrompt = (userCode, language, problem) => {
  return `Analyze this code and give ONLY a percentage (0-100%) for how much optimization is needed based on:
1. Time complexity (O notation) - can it be better?
2. Space complexity (O notation) - can it use less memory?
3. Code efficiency and best practices
4. Alternative approaches that are more optimal
5. Memory usage and unnecessary operations
6. Code readability and maintainability

CRITICAL: For these specific optimal algorithms, ALWAYS give 0-10%:
- Boyer-Moore Majority Vote: if code uses count=0, candidate variable, and increments/decrements count based on equality with candidate
- Binary Search: if code uses while(low<=high) and mid=(low+high)/2
- Hash Map solutions for O(n) problems like Two Sum
- Tree/Graph Traversal: Recursive DFS/BFS for trees is optimal (O(n) time where n is nodes)
- Subtree checking: Recursive comparison is the standard optimal approach
- Note: Recursion is NOT inefficient for tree/graph problems where it's the natural solution

IMPORTANT: For common algorithmic problems, recognize optimal solutions:
- Majority Element: Boyer-Moore voting algorithm is optimal (O(n) time, O(1) space). Hash map solutions are suboptimal (50-60% due to O(n) space).
- Binary Search: O(log n) time is optimal for sorted arrays
- Two Sum: O(n) time with hash map is optimal
- Linked Lists: Recursive solutions are natural and optimal for reversal, merging, etc.
- Backtracking: Recursion is the standard optimal approach for permutations, combinations, subsets
- Divide & Conquer: Recursive merge sort and quick sort are optimal
- Dynamic Programming: Recursion with memoization is optimal and efficient
- Fibonacci: Iterative O(n) OR recursive with memoization are both optimal; naive recursive O(2^n) is bad
- Sorting: Built-in sort is acceptable unless custom implementation needed
- Graph/Tree traversal: DFS/BFS with recursion are optimal

PROBLEM: ${problem || 'General coding problem'}
LANGUAGE: ${language}
CODE: 
\\\`${language}
${userCode}
\\\`

Be strict but fair - if the algorithm is already optimal for the problem constraints, give low percentage (0-20%).
Respond with ONLY a number between 0-100. Nothing else.`;
};

/**
 * Calls Ollama API and extracts percentage from response
 * @param {string} prompt - The prompt to send
 * @returns {Promise<number>} - The extracted percentage (0-100)
 */
const callOllamaAPI = async (prompt) => {
  const response = await fetch(`${CONFIG.OLLAMA_ENDPOINT}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral',
      prompt: prompt,
      stream: false,
      options: {
        temperature: CONFIG.AI_SETTINGS.TEMPERATURE,
        top_p: CONFIG.AI_SETTINGS.TOP_P,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const result = await response.json();
  const aiResponse = result.response.trim();
  
  console.log('Mistral raw response:', aiResponse);

  // Extract percentage from AI response with robust fallback handling
  // Try to find explicit percentage first (e.g., "50%")
  const percentageMatch = aiResponse.match(/(\d+)%/);
  let percentage = CONFIG.AI_SETTINGS.DEFAULT_FALLBACK_PERCENTAGE;
  
  if (percentageMatch) {
    percentage = parseInt(percentageMatch[1]);
  } else {
    // If no percentage format found, try to extract any standalone number
    const numberMatch = aiResponse.match(/\b(\d{1,3})\b/);
    if (numberMatch) {
      percentage = parseInt(numberMatch[1]);
    }
    // If still no number found, defaults to CONFIG.AI_SETTINGS.DEFAULT_FALLBACK_PERCENTAGE (50%)
    // This ensures we always return a reasonable value even if AI response is unparseable
  }

  // Ensure percentage is within valid bounds (0-100)
  return Math.max(0, Math.min(100, percentage));
};

/**
 * Applies pattern-based adjustments to AI percentage
 * @param {number} aiPercentage - AI-suggested percentage
 * @param {string} userCode - User's code
 * @param {string} problem - Problem description
 * @returns {number} - Adjusted percentage
 */
const applyPatternAdjustments = (aiPercentage, userCode, problem, detectOptimalAlgorithms, getPatternSuggestions) => {
  const { isOptimalAlgorithm } = detectOptimalAlgorithms(userCode, problem);
  const patternSuggestion = getPatternSuggestions(userCode, problem);
  
  let adjustedPercentage = aiPercentage;
  
  // Apply logic: For optimal algorithms, cap at 0% to show excellence
  if (isOptimalAlgorithm) {
    adjustedPercentage = 0; // Optimal algorithms get 0% optimization needed
    console.log(`✅ Optimal algorithm detected - setting optimization to 0%`);
  } else if (patternSuggestion && aiPercentage < patternSuggestion.percentage * CONFIG.AI_SETTINGS.SUGGESTION_THRESHOLD) {
    // Only log if AI is very lenient - informational only
    console.log(`AI suggested ${aiPercentage}%, pattern suggests ${patternSuggestion.percentage}% (${patternSuggestion.reason}) - trusting AI`);
  }
  
  return adjustedPercentage;
};

/**
 * Generates feedback based on optimization percentage
 * @param {number} percentage - Optimization percentage (0-100)
 * @returns {Object} - Feedback object with feedback and suggestions
 */
const generateOptimizationFeedback = (percentage) => {
  let feedback = '';
  let suggestions = '';
  
  if (percentage === 0) {
    feedback = '🌟 Perfect! Your algorithm is optimal with best time/space complexity.';
    suggestions = 'Your solution demonstrates optimal algorithmic approach. Excellent work!';
  } else if (percentage <= CONFIG.OPTIMIZATION_THRESHOLDS.EXCELLENT) {
    feedback = '🟢 Excellent! Your code is highly optimized.';
    suggestions = 'Minimal changes needed. Focus on maintaining this quality.';
  } else if (percentage <= CONFIG.OPTIMIZATION_THRESHOLDS.GOOD) {
    feedback = '🟡 Good code with some optimization opportunities.';
    suggestions = 'Consider minor refactoring for better performance and readability.';
  } else if (percentage <= CONFIG.OPTIMIZATION_THRESHOLDS.NEEDS_WORK) {
    feedback = '🟠 Code needs significant optimization.';
    suggestions = 'Refactor for better algorithms, reduce complexity, and improve efficiency.';
  } else {
    feedback = '🔴 Major optimization required!';
    suggestions = 'Complete rewrite recommended. Focus on algorithm efficiency and code structure.';
  }
  
  return { feedback, suggestions };
};

// Code Preparation Utilities - Extract common logic

/**
 * Normalizes line endings to Unix-style
 */
const normalizeLineEndings = (s) => (typeof s === 'string' ? s.replace(/\r\n/g, '\n') : s || '');

/**
 * Extracts function name from code
 */
const extractFunctionName = (code, language) => {
  let functionName = 'solution';
  
  if (language === 'python') {
    const funcMatch = code.match(/(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/);
    if (funcMatch) functionName = funcMatch[1];
  } else if (language === 'javascript') {
    const exportFunc = code.match(/export\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_]\w*)\s*\(/);
    const funcDecl = code.match(/(?:async\s+)?function\s+([A-Za-z_]\w*)\s*\(/);
    const constDecl = code.match(/(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*(?:async\s*)?\s*(?:function|\()/);
    const arrowFunc = code.match(/(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*(?:async\s*)?\s*[^=]*=>/);
    const classMethod = code.match(/(?:async\s+)?([A-Za-z_]\w*)\s*\([^)]*\)\s*\{/);
    
    if (exportFunc) functionName = exportFunc[1];
    else if (funcDecl) functionName = funcDecl[1];
    else if (constDecl) functionName = constDecl[1];
    else if (arrowFunc) functionName = arrowFunc[1];
    else if (classMethod && !['if', 'while', 'for', 'switch', 'catch'].includes(classMethod[1])) 
      functionName = classMethod[1];
  } else if (language === 'java') {
    const javaMethod = code.match(/(?:public|private|protected)?\s+(?:static\s+)?\w+(?:<[^>]+>)?(?:\[\])?\s+([A-Za-z_]\w*)\s*\(/);
    if (javaMethod) functionName = javaMethod[1];
  }
  
  return functionName;
};

/**
 * Validates test case structure
 */
const validateTestCases = (testCases) => {
  if (!testCases || testCases.length === 0) {
    console.warn('No test cases found in question data');
    return [];
  }
  
  const validTestCases = testCases.filter(tc => {
    if (!tc || typeof tc !== 'object') return false;
    if (!('input' in tc) || !('expected' in tc)) return false;
    return true;
  });
  
  if (validTestCases.length === 0) {
    console.warn('No valid test cases found (missing input or expected fields)');
  }
  
  return validTestCases;
};

/**
 * Checks if problem involves trees or linked lists
 */

/**
 * Helper to get Java class definitions for tree and linked list problems
 */
const getJavaHelpers = () => `
    // Helper classes for tree and linked list problems
    static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int x) { val = x; }
    }
    
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int x) { val = x; }
    }
`;

/**
 * Helper to get C/C++ headers and utilities
 */
const getCCPPHelpers = () => `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <math.h>

#define MAX_SIZE 10000
#define MAX_STRING_SIZE 1000

// Helper function to parse integer array from string like "[1,2,3]"
int* parseIntArray(const char* input, int* size) {
    static int arr[MAX_SIZE];
    *size = 0;
    const char* ptr = input;
    
    // Skip opening bracket
    while (*ptr && (*ptr == '[' || *ptr == ' ')) ptr++;
    
    while (*ptr && *ptr != ']') {
        if (*ptr == ',' || *ptr == ' ') {
            ptr++;
            continue;
        }
        // Handle negative numbers
        int sign = 1;
        if (*ptr == '-') {
            sign = -1;
            ptr++;
        }
        if (*ptr >= '0' && *ptr <= '9') {
            arr[(*size)++] = sign * atoi(ptr);
            while (*ptr && *ptr != ',' && *ptr != ']') ptr++;
        } else {
            ptr++;
        }
    }
    return arr;
}

// Helper to parse string from input like ""hello""
char* parseString(const char* input) {
    static char str[MAX_STRING_SIZE];
    int i = 0;
    const char* ptr = input;
    
    // Skip quotes and whitespace
    while (*ptr && (*ptr == '"' || *ptr == '\\'' || *ptr == ' ')) ptr++;
    
    // Copy string content
    while (*ptr && *ptr != '"' && *ptr != '\\'' && i < MAX_STRING_SIZE - 1) {
        str[i++] = *ptr++;
    }
    str[i] = '\\0';
    return str;
}

// Helper to print integer array
void printIntArray(int* arr, int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("%d", arr[i]);
        if (i < size - 1) printf(",");
    }
    printf("]");
}

// Helper to print string
void printString(const char* str) {
    printf("%s", str);
}

// Helper to compare integer arrays
bool compareIntArrays(int* arr1, int size1, int* arr2, int size2) {
    if (size1 != size2) return false;
    for (int i = 0; i < size1; i++) {
        if (arr1[i] != arr2[i]) return false;
    }
    return true;
}

// Helper to compare strings
bool compareStrings(const char* str1, const char* str2) {
    return strcmp(str1, str2) == 0;
}

// TreeNode structure for binary tree problems
struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
};

// Create new tree node
struct TreeNode* createNode(int val) {
    struct TreeNode* node = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    node->val = val;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// ListNode structure for linked list problems
struct ListNode {
    int val;
    struct ListNode* next;
};

// Create new list node
struct ListNode* createListNode(int val) {
    struct ListNode* node = (struct ListNode*)malloc(sizeof(struct ListNode));
    node->val = val;
    node->next = NULL;
    return node;
}
`;

/**
 * Helper function to detect optimal algorithms (reduces duplication between AI functions)
 */
const detectOptimalAlgorithms = (userCode, problem) => {
  // Language-agnostic optimal algorithm detection
  const isBoyerMoore = ((/(?:\$?count|\b(?:int|Integer|var|let|const|let\s+mut)\s+count)\s*(?:=|:=)\s*0/i.test(userCode)) || /count\s*(?:=|:=)\s*0/i.test(userCode))
          && /\$?candidate|candidate/i.test(userCode) &&
          (/(?:\$?count\s*\+\+|\$?count\s*--|\$?count\s*[+-]=\s*1|\$?count\s*\+\s*=\s*[^;]*==\s*\$?candidate|\$?count\s*\+\s*=\s*1\s+if\s+[^;]*==\s*\$?candidate\s+else\s+-1)/i.test(userCode));
  const isBinarySearch = /while\s*\(?\s*\w+\s*<=\s*\w+\s*\)?/i.test(userCode) && 
                        (/Math\.floor\s*\(\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\s*2\s*\)|\w+\s*=\s*parseInt\s*\(\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\s*2\s*\)|\w+\s*=\s*Math\.floor\s*\(\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\s*2\s*\)|\w+\s*=\s*\w+\s*\+\s*\(\s*\w+\s*-\s*\w+\s*\)\s*\/\s*2|\w+\s*=\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\/\s*2|\w+\s*=\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\s*2/i.test(userCode));
  
  const isBuiltInSort = (/(?:\w+\.sort\b|\w+\.sort\s*\(|\bArrays\.sort\b|\bsorted\s*\(|\bsort\s*\(|sort\.Ints\s*\()/i.test(userCode)) && !/bubble|insertion|selection|merge|quick/i.test(userCode);
  
  const isOptimalHashMap = problem && (
    problem.toLowerCase().includes('two sum') ||
    problem.toLowerCase().includes('two numbers') ||
    problem.toLowerCase().includes('contains duplicate') ||
    problem.toLowerCase().includes('subarray sum')
  ) && /new\s+Map\(|unordered_map|HashMap|Map\s*<|Dictionary\b|map\s*\[|array\s*\(|\$?\w+\s*:=\s*map|\$?cnt\s*\[|\bcount\s*\[|\$?count\s*=\s*\{\}|count\.get|count\[|\.getOrDefault|\.put|\.count/i.test(userCode);
  
  const isFloodFillDFS = problem && problem.toLowerCase().includes('flood') &&
    (/def\s+floodFill|function\s+floodFill|public\s+int\[\]\[\]\s+floodFill|def\s+\w+\s*\([^)]*\)\s*:\s*[\s\S]*image[\s\S]*sr[\s\S]*sc[\s\S]*newColor/i.test(userCode) ||
     /class\s+Solution[\s\S]*def\s+floodFill/i.test(userCode)) &&
    /def\s+dfs|function\s+dfs|private\s+void\s+dfs/i.test(userCode) &&
    /r\s*[<>]=?\s*R|r\s*[<>]=?\s*len\(image\)|r\s*[<>]=?\s*image\.length/i.test(userCode) &&
    /c\s*[<>]=?\s*C|c\s*[<>]=?\s*len\(image\[0\]\)|c\s*[<>]=?\s*image\[0\]\.length/i.test(userCode) &&
    /image\[r\]\[c\]\s*!=?\s*originalColor|image\[r\]\[c\]\s*!=?\s*\w+/i.test(userCode) &&
    /dfs\(r\s*[+-]\s*1,\s*c\)|dfs\(r,\s*c\s*[+-]\s*1\)/i.test(userCode);
  
  const isTreeProblem = /tree|node|root|left|right|subtree/i.test(userCode) || (problem && /tree|node|subtree/i.test(problem));
  const isOptimalTreeTraversal = isTreeProblem && 
    /\b([a-zA-Z_][\w]*)\s*\([^)]*\)\s*\{[\s\S]*\b\1\s*\(/.test(userCode) &&
    (/\.left|\['left'\]|\["left"\]/i.test(userCode) || /\.right|\['right'\]|\["right"\]/i.test(userCode));
  
  const isLinkedListProblem = /head|next|ListNode|linkedlist|linked list/i.test(userCode) || (problem && /linked list|listnode/i.test(problem));
  const isOptimalLinkedList = isLinkedListProblem && /\b([a-zA-Z_][\w]*)\s*\([^)]*\)\s*\{[\s\S]*\b\1\s*\(/.test(userCode);
  
  const isBacktrackingProblem = /backtrack|permutation|combination|subset/i.test(userCode) || (problem && /permutation|combination|subset|backtrack/i.test(problem));
  const isOptimalBacktracking = isBacktrackingProblem && /\b([a-zA-Z_][\w]*)\s*\([^)]*\)\s*\{[\s\S]*\b\1\s*\(/.test(userCode);
  
  const hasMemoization = /memo|cache|dp|dynamic/i.test(userCode);
  const isOptimalDPWithMemo = /\b([a-zA-Z_][\w]*)\s*\([^)]*\)\s*\{[\s\S]*\b\1\s*\(/.test(userCode) && hasMemoization;
  
  return {
    isBoyerMoore,
    isBinarySearch,
    isBuiltInSort,
    isOptimalHashMap,
    isFloodFillDFS,
    isOptimalTreeTraversal,
    isOptimalLinkedList,
    isOptimalBacktracking,
    isOptimalDPWithMemo,
    isOptimalAlgorithm: isBoyerMoore || isBinarySearch || isBuiltInSort || isOptimalHashMap || isFloodFillDFS || 
                       isOptimalTreeTraversal || isOptimalLinkedList || isOptimalBacktracking || isOptimalDPWithMemo
  };
};

/**
 * Helper function to get pattern-based suggestions (used by both AI functions)
 */
const getPatternSuggestions = (userCode, problem) => {
  // Majority element with hash map (suboptimal - Boyer-Moore is better)
  if (problem && problem.toLowerCase().includes('majority') &&
      (/new\s+Map\(|unordered_map|HashMap|Map\s*<|Dictionary\b|map\s*\[|array\s*\(|\$?\w+\s*:=\s*map|\$?cnt\s*\[|\bcount\s*\[|\$?count\s*=\s*\{\}|count\.get|count\[|\.getOrDefault|\.put|\.count/i.test(userCode) ||
       /Map\.set|Map\.get|\.hasOwnProperty|Object\.keys|for.*in.*(count|cnt|\w+)/i.test(userCode))) {
    return { 
      percentage: CONFIG.PATTERN_SUGGESTIONS.HASHMAP_SUBOPTIMAL, 
      reason: 'HashMap works but Boyer-Moore is optimal' 
    };
  }
  
  // Quadratic sorting algorithms
  if (/bubble|insertion|selection/i.test(userCode) && /sort/i.test(userCode)) {
    return { 
      percentage: CONFIG.PATTERN_SUGGESTIONS.QUADRATIC_SORT, 
      reason: 'Quadratic sorting is inefficient' 
    };
  }
  
  // Recursive Fibonacci without memoization
  const isRecursiveFibo = ((/fibonacci?\s*\(\s*\$?n\s*-\s*1\s*\)\s*\+\s*fibonacci?\s*\(\s*\$?n\s*-\s*2\s*\)/i.test(userCode) || 
                           /return\s+fibonacci?\s*\(\s*\$?n\s*-\s*1\s*\)\s*\+\s*fibonacci?\s*\(\s*\$?n\s*-\s*2\s*\)/i.test(userCode))) && 
                           !/memo|cache|dp|dynamic/i.test(userCode);
  if (problem && problem.toLowerCase().includes('fibonacci') && isRecursiveFibo) {
    return { 
      percentage: CONFIG.PATTERN_SUGGESTIONS.FIBONACCI_NO_MEMO, 
      reason: 'Exponential complexity is critical' 
    };
  }
  
  return null; // No pattern suggestion
};

export default function TestInterface() {
  const location = useLocation();
  const questionsConfig = location.state || {};
  const passedTestId = questionsConfig?.testId;
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState('');
  const [userCode, setUserCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [timeLeft, setTimeLeft] = useState(CONFIG.TEST_DURATION);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [aiOptimizationPercentage, setAiOptimizationPercentage] = useState(null);
  
  const [testCompleted, setTestCompleted] = useState(false);
  const [aiPercentageLoading, setAiPercentageLoading] = useState(false);

  // Initialize questions by loading from localStorage using testId
  useEffect(() => {
    if (!passedTestId) return;
    try {
      const saved = localStorage.getItem(`test:${passedTestId}`);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      const qs = Array.isArray(parsed?.questions) ? parsed.questions : [];
      setTestQuestions(qs);
      setTotalQuestions(qs.length);
      if (qs.length > 0) {
        setCurrentQuestionData(qs[0]);
        setCurrentDifficulty(qs[0]?.difficulty || '');
      }
    } catch (e) {
      console.error('Failed to load questions for test:', e);
    }
  }, [passedTestId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !testCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setTestCompleted(true);
    }
  }, [timeLeft, testCompleted]);

  // Helper function to prepare code for execution with test cases (Refactored)
  const prepareCodeForExecution = (code, lang, questionData) => {
    // Normalize language to lowercase for consistent switch case matching
    const normalizedLang = (lang || '').toLowerCase().trim();
    
    // Use utility functions
    const userCodeRaw = normalizeLineEndings(code);
    
    // Normalize indentation: convert tabs to spaces (4 for Python, 2 for others)
    const tabSize = normalizedLang === 'python' ? 4 : 2;
    let normalizedCode = userCodeRaw.replace(/\t/g, ' '.repeat(tabSize));
    
    // Trim trailing whitespace from each line
    normalizedCode = normalizedCode.split('\n').map(line => line.trimEnd()).join('\n');
    
    // Extract function name using utility
    let functionName = extractFunctionName(normalizedCode, normalizedLang);
    
    // FALLBACK: If no function found in code, try to extract from signature
    if (functionName === 'solution') {
      try {
        const sig = (questionData && questionData.functionSignature) || '';
        if (normalizedLang === 'python') {
          const m = sig.match(/def\s+([A-Za-z_]\w*)/);
          if (m) functionName = m[1];
        } else {
          const m1 = sig.match(/function\s+([A-Za-z_]\w*)/);
          const m2 = sig.match(/(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*(?:async\s*)?\(/);
          const m3 = sig.match(/([A-Za-z_]\w*)\s*=\s*\([^)]\)\s=>/);
          if (m1) functionName = m1[1];
          else if (m2) functionName = m2[1];
          else if (m3) functionName = m3[1];
          else {
            const m4 = sig.match(/([A-Za-z_]\w*)\s*\(/);
            if (m4) functionName = m4[1];
          }
        }
      } catch (e) {
        console.warn('Failed to parse function signature for tests:', e);
      }
    }
    
    const testCases = (questionData && questionData.testCases) || [];
    
    // Validate test cases using utility
    const validTestCases = validateTestCases(testCases);
    
    if (validTestCases.length === 0) {
      return normalizeLineEndings(code);
    }

    // Debug: Log language for verification
    console.log(`[prepareCodeForExecution] Language: "${lang}" -> Normalized: "${normalizedLang}"`);

    // Delegate to language-specific harness generators
    switch (normalizedLang) {
      case 'javascript':
        return generateJavaScriptHarness(normalizedCode, functionName, validTestCases, questionData);
      
      case 'python':
        return generatePythonHarness(normalizedCode, functionName, validTestCases, questionData);
      
      case 'java':
        return generateJavaHarness(normalizedCode, functionName, validTestCases, questionData);
      
      case 'c':
      case 'c++':
        return generateCCPPHarness(normalizedCode, functionName, validTestCases);
      
      default:
        console.warn(`Language '${normalizedLang}' (original: '${lang}') is not fully supported. Supported languages: JavaScript, Python, Java, C, C++. Using basic code normalization.`);
        return normalizeLineEndings(normalizedCode);
    }
  };

  /**
   * Generates Java test harness (inline for now, can be extracted later)
   */
  const generateJavaHarness = (normalizedCode, functionName, validTestCases, questionData) => {
    // Extract imports from user code and place them at top level
    const importLines = [];
    const codeLines = [];
    
    normalizedCode.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ')) {
        importLines.push(trimmed);
      } else {
        codeLines.push(line);
      }
    });
    
    const userCodeWithoutImports = codeLines.join('\n');
    
    // Check if this is a tree or linked list problem
    const isTreeOrLinkedListProblem = /tree|node|root|left|right|head|next|listnode|treenode/i.test(questionData?.problem || '') ||
                                      /TreeNode|ListNode|tree|node|root|left|right|head|next/i.test(normalizedCode || '');
    
    // Get Java helpers if needed
    const javaHelpers = isTreeOrLinkedListProblem ? getJavaHelpers() : '';
    
    const testCode = validTestCases.map((tc, idx) => {
      const inputStr = typeof tc.input === 'string' ? tc.input : '';
      let expected = tc.expected;
      
      // Convert string booleans to actual booleans
      if (typeof expected === 'string') {
        const lower = expected.toLowerCase().trim();
        if (lower === 'true') expected = true;
        else if (lower === 'false') expected = false;
      }
      
      // For Java, use true/false (lowercase) for booleans
      const expectedJava = expected === true ? 'true' : expected === false ? 'false' : expected;
      
      // Parse input to extract variable assignments and function arguments
      const assignments = [];
      const funcArgs = [];
      
      // Use utility function to parse input
      const parts = parseInputString(inputStr);
      
      // Fallback to original assignment-style parsing for all cases
      parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed) {
          // Convert Python-style arrays to Java arrays
          let converted = trimmed;
          
          // Handle 2D arrays like image = [[1,1,1],[1,1,0],[1,0,1]]
          const twoDArrayMatch = trimmed.match(/(\w+)\s*=\s*(\[\[.*\]\])/);
          if (twoDArrayMatch) {
            const varName = twoDArrayMatch[1];
            const arrayStr = twoDArrayMatch[2];
            try {
              // Parse the nested array and convert to Java 2D array syntax
              const parsed = JSON.parse(arrayStr);
              if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
                // It's a 2D array
                const javaArray = parsed.map(row => `{${row.join(',')}}`).join(',');
                converted = `int[][] ${varName} = {${javaArray}};`;
              }
            } catch {
              // Fallback to original if parsing fails
              converted = trimmed;
            }
          } else {
            // Handle 1D arrays
            const oneDArrayMatch = trimmed.match(/(\w+)\s*=\s*\[([^\]]*)\]/);
            if (oneDArrayMatch) {
              const varName = oneDArrayMatch[1];
              const arrayContent = oneDArrayMatch[2];
              // Check if it's an integer array by looking at the content
              const isIntArray = /^\s*\d+(\s*,\s*\d+)*\s*$/.test(arrayContent);
              if (isIntArray) {
                converted = `int[] ${varName} = {${arrayContent}};`;
              } else {
                // For non-integer arrays, keep as is for now
                converted = trimmed;
              }
            } else {
              // Handle simple integer assignments like 'sr = 1'
              const intMatch = trimmed.match(/(\w+)\s*=\s*(\d+)/);
              if (intMatch) {
                converted = `int ${intMatch[1]} = ${intMatch[2]};`;
              } else {
                // Keep as is for other cases
                converted = trimmed;
              }
            }
          }
          
          assignments.push(converted);
          // Extract variable name from assignment
          const varMatch = converted.match(/(\w+)\s*=/);
          if (varMatch) funcArgs.push(varMatch[1]);
        }
      });
      
      return `        try {
            ${assignments.join(';\n            ')};
            ${functionName === 'floodFill' ? 'int[][]' : typeof expected === 'string' && !isNaN(expected) ? 'int' : expected === true || expected === false ? 'boolean' : 'Object'} result = solution.${functionName}(${funcArgs.join(', ')});
            boolean passed;
            
            // Generate expected value declaration based on type
            ${(() => {
              if (typeof expected === 'boolean') {
                return `boolean expectedValue = ${expectedJava};
            passed = result == expectedValue;`;
              } else if (typeof expected === 'number') {
                return `int expectedValue = ${expectedJava};
            passed = result == expectedValue;`;
              } else if (typeof expected === 'string') {
                try {
                  const parsed = JSON.parse(expected);
                  if (Array.isArray(parsed)) {
                    if (parsed.length > 0 && Array.isArray(parsed[0])) {
                      const javaArray = parsed.map(row => `{${row.join(',')}}`).join(',');
                      return `int[][] expectedValue = {${javaArray}};
            passed = java.util.Arrays.deepEquals(result, expectedValue);`;
                    } else {
                      return `int[] expectedValue = {${parsed.join(',')}};
            passed = java.util.Arrays.equals(result, expectedValue);`;
                    }
                  }
                } catch {
                  // Not a parseable array
                }
                return `String expectedValue = ${expectedJava};
            passed = java.util.Objects.equals(result, expectedValue);`;
              }
              return `Object expectedValue = ${expectedJava};
            passed = java.util.Objects.equals(result, expectedValue);`;
            })()}
            
            System.out.println("{\\"test\\":${idx + 1},\\"status\\":\\"" + (passed ? "PASS" : "FAIL") + "\\"}");
        } catch (Exception e) {
            System.out.println("{\\"test\\":${idx + 1},\\"status\\":\\"ERROR\\",\\"error\\":\\"" + e.getMessage() + "\\"}");
        }`;
    }).join('\n');

    return `${importLines.length > 0 ? importLines.join('\n') + '\n\n' : ''}import java.util.*;

public class Main {
${javaHelpers}
    ${userCodeWithoutImports.replace(/^/gm, '    ').replace(/class\s+\w+/g, 'static class Solution')}

    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println("=== TEST RESULTS ===");
${testCode}
        System.out.println("=== EXECUTION COMPLETE ===");
    }
}`.replace(/\r\n/g, '\n');
  };

  /**
   * Generates C/C++ test harness (inline for now, can be extracted later)
   */
  const generateCCPPHarness = (normalizedCode, functionName, validTestCases) => {
    const cppHelpers = getCCPPHelpers();
    
    const testCode = validTestCases.map((testCase, index) => {
      const inputStr = typeof testCase.input === 'string' ? testCase.input : '';
      let expected = testCase.expected;
      
      // Detect input type
      const isArrayInput = /^\[.*\]$/.test(inputStr.trim());
      const isStringInput = /^["'].*["']$/.test(inputStr.trim());
      const isMultipleInputs = inputStr.includes(',') && !isArrayInput;
      
      // Generate test code based on input type
      let testCode = '';
      
      if (isArrayInput) {
        // Array input handling
        const expectedStr = Array.isArray(expected) ? `[${expected.join(',')}]` : String(expected);
        testCode = `
    // Test ${index + 1}: Array input
    {
        int size;
        int* input = parseIntArray("${inputStr}", &size);
        ${Array.isArray(expected) ? `
        int expectedSize;
        int* expectedArr = parseIntArray("${expectedStr}", &expectedSize);
        int* result = ${functionName}(input, size);
        bool passed = compareIntArrays(result, size, expectedArr, expectedSize);
        ` : `
        int result = ${functionName}(input, size);
        int expectedValue = ${expected};
        bool passed = (result == expectedValue);
        `}
        printf("{\\"test\\":${index + 1},\\"status\\":\\"%s\\"}\\n", passed ? "PASS" : "FAIL");
    }`;
      } else if (isStringInput) {
        // String input handling
        const expectedStr = typeof expected === 'string' ? expected.replace(/['"]/g, '') : String(expected);
        testCode = `
    // Test ${index + 1}: String input
    {
        char* input = parseString("${inputStr}");
        ${typeof expected === 'string' ? `
        char* expectedStr = "${expectedStr}";
        char* result = ${functionName}(input);
        bool passed = compareStrings(result, expectedStr);
        ` : `
        int result = ${functionName}(input);
        int expectedValue = ${expected};
        bool passed = (result == expectedValue);
        `}
        printf("{\\"test\\":${index + 1},\\"status\\":\\"%s\\"}\\n", passed ? "PASS" : "FAIL");
    }`;
      } else if (isMultipleInputs) {
        // Multiple simple inputs (e.g., "x=5, y=10")
        const inputs = inputStr.split(',').map(s => s.trim());
        const assignments = inputs.map(input => {
          const match = input.match(/(\w+)\s*=\s*(.+)/);
          if (match) {
            return `int ${match[1]} = ${match[2]};`;
          }
          return '';
        }).filter(Boolean);
        
        testCode = `
    // Test ${index + 1}: Multiple inputs
    {
        ${assignments.join('\n        ')}
        int result = ${functionName}(${inputs.map(i => i.split('=')[0].trim()).join(', ')});
        int expectedValue = ${typeof expected === 'string' && !isNaN(expected) ? parseInt(expected) : expected};
        bool passed = (result == expectedValue);
        printf("{\\"test\\":${index + 1},\\"status\\":\\"%s\\"}\\n", passed ? "PASS" : "FAIL");
    }`;
      } else {
        // Simple single input
        const cleanInput = inputStr.replace(/[a-zA-Z_]\w*\s*=\s*/, '');
        testCode = `
    // Test ${index + 1}: Simple input
    {
        int input = ${cleanInput};
        ${Array.isArray(expected) ? `
        int expectedSize;
        int* expectedArr = parseIntArray("${JSON.stringify(expected)}", &expectedSize);
        int* result = ${functionName}(input);
        // Note: Array return requires size parameter
        printf("{\\"test\\":${index + 1},\\"status\\":\\"ERROR\\",\\"error\\":\\"Array return not fully supported\\"}\\n");
        ` : `
        int result = ${functionName}(input);
        int expectedValue = ${typeof expected === 'string' && !isNaN(expected) ? parseInt(expected) : expected};
        bool passed = (result == expectedValue);
        printf("{\\"test\\":${index + 1},\\"status\\":\\"%s\\"}\\n", passed ? "PASS" : "FAIL");
        `}
    }`;
      }
      
      return testCode;
    }).join('');

    return `
${cppHelpers}

${normalizedCode}

int main() {
    printf("=== TEST RESULTS ===\\n");
${testCode}
    printf("=== EXECUTION COMPLETE ===\\n");
    return 0;
}
`.replace(/\r\n/g, '\n');
  };

  // Helper function to calculate code complexity score and metrics
  const calculateComplexityScore = (code) => {
    const lines = code.split('\n').filter(line => line.trim().length > 0).length;
    const chars = code.length;
    const functions = (code.match(/function\s+\w+/g) || []).length + (code.match(/\w+\s*\([^)]*\)\s*\{/g) || []).length;
    const loops = (code.match(/\b(for|while)\b/g) || []).length;
    const conditionals = (code.match(/\b(if|else|switch)\b/g) || []).length;
    const variables = (code.match(/\b(var|let|const)\b/g) || []).length;

    let score = 0;
    score += Math.min(lines * 2, 40);
    score += Math.min(chars / 10, 30);
    score += functions * 5;
    score += loops * 4; // give loops a bit more weight
    score += conditionals * 2;
    score += variables * 1;

    score = Math.min(score, 100);

    return {
      score,
      lines,
      chars,
      functions,
      loops,
      conditionals,
      variables
    };
  };

  // Evaluate the execution results against test cases
  const evaluateAgainstTestCases = (pistonResult, testCases, userCode) => {
    const stdout = (pistonResult.run && (pistonResult.run.stdout || pistonResult.run.output)) || '';
    const stderr = (pistonResult.run && pistonResult.run.stderr) || '';
    const executionTime = (pistonResult.run && pistonResult.run.time) || 0;

    const combined = [stdout, stderr].join('\n');

    console.log('Raw stdout:', stdout);
    console.log('Raw stderr:', stderr);

    // Split into lines and parse JSON test results
    const lines = combined.split('\n').map(l => l.trim()).filter(Boolean);
    
    // Parse JSON test results to avoid false positives
    const testResults = [];
    let jsonParseFailures = 0;
    
    lines.forEach(line => {
      try {
        const parsed = JSON.parse(line);
        if (parsed.test && parsed.status) {
          testResults.push(parsed);
        }
      } catch (e) {
        // Not a JSON test result, try legacy regex as fallback
        if (/^Test\s+\d+\s*:\s*(PASS|FAIL|ERROR)/i.test(line)) {
          jsonParseFailures++;
          console.debug('JSON parse failed for test result, using regex fallback:', line, e.message);
          const match = line.match(/^Test\s+(\d+)\s*:\s*(PASS|FAIL|ERROR)(?:\s+(.*))?/i);
          if (match) {
            testResults.push({
              test: parseInt(match[1]),
              status: match[2].toUpperCase(),
              error: match[3] || undefined
            });
          }
        }
      }
    });
    
    if (jsonParseFailures > 0) {
      console.warn(`Fallback to regex parsing for ${jsonParseFailures} test results`);
    }
    
    console.log('Found test results:', testResults);

    const passedTests = testResults.filter(r => r.status === 'PASS').length;
    const errorTests = testResults.filter(r => r.status === 'ERROR').length;
    const totalTests = Array.isArray(testCases) && testCases.length ? testCases.length : testResults.length || 0;

    console.log('Passed:', passedTests, 'Total:', totalTests, 'Errors:', errorTests);

    const allPassed = totalTests > 0 && passedTests === totalTests;
    const anyPassed = passedTests > 0;
    const hasErrors = errorTests > 0;

    // Simple complexity-based fallback (only used if AI analysis is unavailable)
    // Primary optimization analysis should use AI via analyzeWithMistral()
    const complexity = calculateComplexityScore(userCode);
    const complexityScore = complexity.score;

    // Compute a basic refactoring percentage as fallback
    // This is a simple heuristic - AI analysis (analyzeWithMistral) provides much more accurate results
    let refactoringPercentage;
    if (totalTests > 0) {
      if (allPassed) {
        // Base percentage from code complexity (0-100)
        // Use moderate multiplier for reasonable fallback estimates
        refactoringPercentage = Math.min(100, Math.round(complexityScore * 0.5));
      } else {
        // If tests fail, base percentage on failure rate
        const failureBased = Math.round((1 - (passedTests / totalTests)) * 100);
        refactoringPercentage = Math.min(100, failureBased);
      }
    } else {
      // No tests found; use basic complexity score
      refactoringPercentage = Math.min(100, Math.round(complexityScore * 0.5));
    }

    const refactoringPotential = `${refactoringPercentage}%`;

    // Generate feedback based on results
    let feedback = '';
    if (allPassed) {
      feedback = '🎉 Excellent! All test cases passed!';
    } else if (anyPassed) {
      feedback = `⚠ ${passedTests}/${totalTests} test cases passed. Review the failed cases.`;
    } else if (hasErrors) {
      feedback = '❌ Code contains errors. Check the output for details.';
    } else {
      feedback = '❌ No test cases passed. Review your solution.';
    }

    return {
      testResults: `${passedTests}/${totalTests} test cases passed`,
      feedback: feedback,
      output: stdout,
      error: stderr,
      executionTime: executionTime,
      passed: allPassed,
      // Provide refactoring guidance based on the test pass ratio
      showRefactoring: true,
  refactoringPotential,
  refactoringPercentage,
      detailedResults: testResults
    };
  };

  // Note: detectOptimalAlgorithms and getPatternSuggestions are now defined outside the component for reusability

  // Analyze code for optimization using DIRECT Mistral AI (Refactored with utilities)
  const analyzeWithMistral = async (userCode, language, problem) => {
    try {
      console.log('🤖 Calling Mistral AI via Ollama...');
      
      // Use utility to create prompt
      const optimizationPrompt = createOptimizationPrompt(userCode, language, problem);
      
      // Call Ollama API using utility
      let optimizationPercentage = await callOllamaAPI(optimizationPrompt);
      
      // Apply pattern-based adjustments using utility
      optimizationPercentage = applyPatternAdjustments(
        optimizationPercentage, 
        userCode, 
        problem, 
        detectOptimalAlgorithms, 
        getPatternSuggestions
      );

      // Generate feedback using utility
      const { feedback, suggestions } = generateOptimizationFeedback(optimizationPercentage);

      return {
        optimizationPercentage,
        refactoringPotential: `${optimizationPercentage}%`,
        qualityFeedback: feedback,
        optimizationSuggestions: suggestions,
        codeExample: generateOptimizedExample(language, problem, optimizationPercentage)
      };

    } catch (error) {
      console.error('Mistral AI analysis failed:', error);
      // Fallback to basic complexity-based estimation
      // Note: This is a simple heuristic and less accurate than AI analysis
      const fallback = calculateComplexityScore(userCode);
      const fallbackPercentage = Math.min(100, Math.round(fallback.score * 0.5));
      
      return {
        optimizationPercentage: fallbackPercentage,
        refactoringPotential: `${fallbackPercentage}%`,
        qualityFeedback: '⚠ AI analysis unavailable. Using basic complexity estimation (less accurate).',
        optimizationSuggestions: 'Consider reviewing time/space complexity and code structure. For accurate analysis, ensure Ollama/Mistral is running.',
        codeExample: ''
      };
    }
  };

  // Get AI optimization percentage only (Refactored to use analyzeWithMistral)
  const getAIOptimizationPercentage = async (userCode, language, problem) => {
    setAiPercentageLoading(true);
    
    try {
      // Reuse analyzeWithMistral to get comprehensive analysis
      const analysis = await analyzeWithMistral(userCode, language, problem);
      
      // Extract just the percentage from the analysis
      setAiOptimizationPercentage(analysis.optimizationPercentage);
    } catch (error) {
      console.error('AI percentage fetch failed:', error);
      setAiOptimizationPercentage(CONFIG.AI_SETTINGS.DEFAULT_FALLBACK_PERCENTAGE);
    } finally {
      setAiPercentageLoading(false);
    }
  };

  // Generate optimized code example based on optimization percentage
  const generateOptimizedExample = (language, problem, percentage) => {
    if (percentage < 30) return '// Your code is already well optimized!';
    
    if (problem && problem.toLowerCase().includes('majority')) {
      return `// Optimized Majority Element (Boyer-Moore Voting Algorithm - O(n) time, O(1) space)
function majorityElement(nums) {
  let count = 0;
  let candidate;
  
  for (let num of nums) {
    if (count === 0) {
      candidate = num;
    }
    count += (num === candidate) ? 1 : -1;
  }
  
  return candidate;
}`;
    }

    if (problem && problem.toLowerCase().includes('fibonacci')) {
      return `// Optimized Fibonacci example (iterative O(n))
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}`;
    }

    if (problem && problem.toLowerCase().includes('power')) {
      return `// Optimized Power of Two check (bit manipulation)
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`;
    }

    if (problem && problem.toLowerCase().includes('flood')) {
      return `// Your DFS flood fill is already optimal!
// Time: O(R*C) - visits each cell once
// Space: O(R*C) worst case for call stack
function floodFill(image, sr, sc, newColor) {
  const R = image.length;
  const C = image[0].length;
  const originalColor = image[sr][sc];
  
  if (originalColor === newColor) return image;
  
  const dfs = (r, c) => {
    if (r < 0 || r >= R || c < 0 || c >= C || 
        image[r][c] !== originalColor) {
      return;
    }
    
    image[r][c] = newColor;
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };
  
  dfs(sr, sc);
  return image;
}`;
    }

    return `// Optimized solution structure
function optimizedSolution(input) {
  // Focus on:
  // - Time complexity reduction
  // - Space efficiency  
  // - Clean, readable code
  // - Proper error handling
  return processedResult;
}`;
  };

  // Submit code for evaluation using Piston API
  const submitCode = async () => {
    if (!userCode.trim()) {
      console.error('Validation failed: No code provided');
      setSubmissionResult({ 
        testResults: '⚠️ Please write some code before submitting.',
        passed: false,
        feedback: 'Code validation failed'
      });
      return;
    }

    setIsLoading(true);
    setSubmissionResult(null);
    setOptimizationResult(null);

    try {
      // Prepare the code for execution with test cases
      const executableCode = prepareCodeForExecution(userCode, language, currentQuestionData);
      
      // Log to console for debugging
      console.log('=== SUBMIT DEBUG ===');
      console.log('Language:', language);
      console.log('Question Data:', currentQuestionData);
      console.log('Test Cases:', currentQuestionData?.testCases);
      console.log('=== EXECUTABLE CODE ===');
      console.log(executableCode);
      console.log('=== END EXECUTABLE CODE ===');
      
      if (!executableCode || executableCode.trim().length === 0) {
        throw new Error('Generated executable code is empty');
      }
      
      const requestBody = {
        language: language,
        version: '*',
        files: [{ content: executableCode }]
      };
      
      console.log('Request body length:', JSON.stringify(requestBody).length);
      
      const response = await fetch(CONFIG.PISTON_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        
        // Log raw response for debugging
        console.log('=== PISTON RAW RESPONSE ===');
        console.log(JSON.stringify(data, null, 2));
        console.log('=== END RESPONSE ===');
        
        // Parse the result and check against test cases
        const evaluationResult = evaluateAgainstTestCases(data, currentQuestionData.testCases, userCode);
        
        setSubmissionResult(evaluationResult);

        // Get AI optimization percentage if tests passed
        if (evaluationResult.passed) {
          getAIOptimizationPercentage(userCode, language, currentQuestionData?.problem);
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error executing code:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      setSubmissionResult({
        testResults: 'Execution failed',
        feedback: 'Could not execute code. Check browser console (F12) for details. Error: ' + (error.message || JSON.stringify(error)),
        output: '',
        error: error.message || 'Unknown error',
        passed: false,
        showRefactoring: false,
        refactoringPotential: '0%',
        refactoringPercentage: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze code for optimization using DIRECT Mistral AI
  const analyzeOptimization = async () => {
    if (!submissionResult) {
      console.error('Validation failed: Solution not submitted');
      setOptimizationResult({
        feedback: '⚠️ Please submit your solution first before running optimization.',
        optimizationPercentage: null
      });
      return;
    }
    if (!userCode.trim()) {
      console.error('Validation failed: No code provided');
      setOptimizationResult({
        feedback: '⚠️ Please write some code before analyzing optimization.',
        optimizationPercentage: null
      });
      return;
    }
    if (!currentQuestionData) {
      console.error('Validation failed: No question selected');
      setOptimizationResult({
        feedback: '⚠️ No question selected to analyze.',
        optimizationPercentage: null
      });
      return;
    }

    setIsAnalyzing(true);
    setOptimizationResult(null);

    try {
      // Use DIRECT Mistral AI analysis
      const mistralResult = await analyzeWithMistral(
        userCode,
        language,
        currentQuestionData.problem
      );

      setOptimizationResult(mistralResult);
    } catch (err) {
      console.error('Error during optimization analysis:', err);
      setOptimizationResult({
        optimizationPercentage: 50,
        refactoringPotential: '50%',
        qualityFeedback: '❌ Optimization analysis failed',
        optimizationSuggestions: 'Please try again later.',
        codeExample: ''
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setCurrentQuestionData(testQuestions[nextQ - 1]);
      setCurrentDifficulty(testQuestions[nextQ - 1].difficulty);
      setUserCode('');
      setSubmissionResult(null);
      setOptimizationResult(null);
      setAiOptimizationPercentage(null);
    } else {
      setTestCompleted(true);
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestion > 1) {
      const prevQ = currentQuestion - 1;
      setCurrentQuestion(prevQ);
      setCurrentQuestionData(testQuestions[prevQ - 1]);
      setCurrentDifficulty(testQuestions[prevQ - 1].difficulty);
      setUserCode('');
      setSubmissionResult(null);
      setOptimizationResult(null);
      setAiOptimizationPercentage(null);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#f44336';
      default: return '#666';
    }
  };

  const languages = [
    'javascript', 'python', 'java', 'c', 'c++'
  ];

  // If no questions are available, show an informative message
  if (!testQuestions.length) {
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
        <h2>No Questions Found</h2>
        <p style={{ color: 'var(--muted)' }}>This Test ID has no saved questions. The creator must generate and save questions first.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/create-test" className="btn primary">Go to Create Test</Link>
        </div>
      </div>
    );
  }

  // Determine which refactoring percentage to display: prefer AI results
  const displayedRefactoringPercentage = aiOptimizationPercentage !== null ? aiOptimizationPercentage : (optimizationResult && typeof optimizationResult.optimizationPercentage === 'number')
    ? optimizationResult.optimizationPercentage
    : (submissionResult && typeof submissionResult.refactoringPercentage === 'number')
      ? submissionResult.refactoringPercentage
      : 0;

  const displayedRefactoringPotential = aiOptimizationPercentage !== null ? `${aiOptimizationPercentage}%` : (optimizationResult && optimizationResult.refactoringPotential)
    ? optimizationResult.refactoringPotential
    : (submissionResult && submissionResult.refactoringPotential)
      ? submissionResult.refactoringPotential
      : '0%';

  // Show test completed screen
  if (testCompleted) {
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
        <h1>Test Completed!</h1>
        <div style={{
          background: 'var(--card)',
          padding: '30px',
          borderRadius: '12px',
          margin: '30px auto',
          maxWidth: '500px',
          border: '2px solid var(--brand)'
        }}>
          <h2>Test Summary</h2>
          <p style={{ color: 'var(--muted)' }}>
            You completed {totalQuestions} questions in {formatTime(3600 - timeLeft)}
          </p>
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'var(--bg)', 
            borderRadius: '8px' 
          }}>
            <p><strong>Questions Completed:</strong> {totalQuestions}</p>
            <p><strong>Time Taken:</strong> {formatTime(3600 - timeLeft)}</p>
          </div>
        </div>
        <div style={{ marginTop: '30px' }}>
          <Link to="/create-test" className="btn primary">
            Take Another Test
          </Link>
          <Link to="/" className="btn secondary" style={{ marginLeft: '10px' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">Algorythm</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/create-test" className="nav-link">Create Test</Link>
          </nav>
        </div>
      </header>

      {/* Test Header */}
      <section className="hero" style={{ padding: '30px 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div>
            <h1>🧪 Coding Test</h1>
            <p>Question {currentQuestion} of {totalQuestions} • Difficulty: <span style={{ 
              color: getDifficultyColor(currentDifficulty),
              fontWeight: 'bold'
            }}>{currentDifficulty}</span></p>
          </div>
          <div style={{ 
            background: 'var(--card)', 
            padding: '15px 20px', 
            borderRadius: '8px',
            border: '2px solid var(--brand)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Time Remaining</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '20px auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Question Section */}
        <div>
          <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '12px', marginBottom: '20px' }}>
            <h3>📝 Problem Statement</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
              {currentQuestionData?.problem}
            </p>

            {currentQuestionData?.functionSignature && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Function Signature:</h4>
                <pre style={{
                  background: 'var(--bg)',
                  padding: '15px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  border: '1px solid var(--border)'
                }}>
                  {currentQuestionData.functionSignature}
                </pre>
              </div>
            )}

            {currentQuestionData?.exampleInput && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Example:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <strong>Input:</strong>
                    <pre style={{
                      background: 'var(--bg)',
                      padding: '10px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      marginTop: '5px'
                    }}>
                      {currentQuestionData.exampleInput}
                    </pre>
                  </div>
                  <div>
                    <strong>Expected Output:</strong>
                    <pre style={{
                      background: 'var(--bg)',
                      padding: '10px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      marginTop: '5px'
                    }}>
                      {currentQuestionData.expectedOutput}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {currentQuestionData?.constraints && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Constraints:</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  {currentQuestionData.constraints}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Programming Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Your Solution:
              </label>
              <div style={{ 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                overflow: 'hidden' 
              }}>
                <Editor
                  height="400px"
                  language={language}
                  value={userCode}
                  onChange={(value) => setUserCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    tabSize: 2,
                    insertSpaces: true,
                    detectIndentation: true,
                    autoIndent: 'full',
                    formatOnPaste: true,
                    formatOnType: true,
                    bracketPairColorization: { enabled: true },
                    guides: { bracketPairs: true },
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: 'on',
                    quickSuggestions: { other: true, comments: false, strings: true },
                    parameterHints: { enabled: true },
                    hover: { enabled: true },
                    contextmenu: true,
                    mouseWheelZoom: true,
                    smoothScrolling: true,
                    cursorBlinking: 'blink',
                    renderWhitespace: 'selection',
                    renderControlCharacters: false,
                    fontFamily: 'Consolas, "Courier New", monospace',
                    fontLigatures: true,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={submitCode}
                disabled={isLoading || !userCode.trim()}
                className="btn primary"
                style={{ flex: 1, padding: '15px' }}
              >
                {isLoading ? '🔄 Executing...' : '✅ Submit Solution'}
              </button>
              
              <button
                onClick={analyzeOptimization}
                disabled={isAnalyzing || !submissionResult}
                className="btn secondary"
                style={{ flex: 1, padding: '15px' }}
              >
                {isAnalyzing ? '🤖 Analyzing...' : '🚀 Optimization'}
              </button>
            </div>

            <div style={{ 
              background: 'var(--bg)', 
              padding: '10px', 
              borderRadius: '6px',
              border: '1px solid var(--border)',
              fontSize: '0.8rem',
              color: 'var(--muted)',
              textAlign: 'center'
            }}>
              <strong>💡 Tip:</strong> Submit first to test correctness, then optimize for better code quality
            </div>
          </div>

          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            background: 'var(--card)', 
            padding: '20px', 
            borderRadius: '12px' 
          }}>
            <button 
              className="btn secondary"
              onClick={prevQuestion}
              disabled={currentQuestion === 1}
            >
              ← Previous Question
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Progress</div>
              <div style={{ fontWeight: 'bold' }}>
                {currentQuestion} / {totalQuestions}
              </div>
            </div>
            
            <button 
              className="btn primary"
              onClick={nextQuestion}
              disabled={currentQuestion === totalQuestions}
            >
              {currentQuestion === totalQuestions ? 'Finish Test' : 'Next Question →'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div>
          <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '12px', marginBottom: '20px' }}>
            <h3>📊 Submission Results</h3>

            {isLoading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⚡</div>
                <p>Executing your code on server...</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Running against test cases</p>
              </div>
            )}

            {isAnalyzing && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🤖</div>
                <p>AI is analyzing your code...</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Checking for optimization opportunities</p>
              </div>
            )}

            {submissionResult && (
              <div style={{ marginBottom: '12px' }}>
                {/* Refactoring potential card based on submission results */}
                {aiPercentageLoading && (
                  <div style={{ 
                    background: 'var(--bg)', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    marginBottom: '12px',
                    border: '2px solid #999',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '6px' }}>
                      Analyzing code for optimization...
                    </div>
                    <div style={{ fontSize: '1.5rem' }}>⏳</div>
                  </div>
                )}
                
                {aiOptimizationPercentage !== null && !aiPercentageLoading && (
                  <div style={{ 
                    background: 'var(--bg)', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    marginBottom: '12px',
                    border: `2px solid ${displayedRefactoringPercentage === 0 ? '#00C853' : displayedRefactoringPercentage <= 20 ? '#4CAF50' : displayedRefactoringPercentage <= 50 ? '#FF9800' : displayedRefactoringPercentage <= 80 ? '#FF5722' : '#f44336'}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '6px' }}>
                      Optimization Required
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: displayedRefactoringPercentage === 0 ? '#00C853' : displayedRefactoringPercentage <= 20 ? '#4CAF50' : displayedRefactoringPercentage <= 50 ? '#FF9800' : displayedRefactoringPercentage <= 80 ? '#FF5722' : '#f44336' }}>
                      {displayedRefactoringPotential}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {displayedRefactoringPercentage === 0 ? '🌟 Optimal Algorithm!' : 
                       displayedRefactoringPercentage <= 20 ? '🟢 Highly Optimized' : 
                       displayedRefactoringPercentage <= 50 ? '🟡 Minor Optimization' : 
                       displayedRefactoringPercentage <= 80 ? '🟠 Significant Optimization' : 
                       '🔴 Major Optimization Needed'}
                    </div>
                  </div>
                )}

                <h4>Test Results:</h4>
                <p style={{ color: submissionResult.passed ? 'var(--success)' : 'var(--error)', fontWeight: 'bold', fontSize: '1.1rem' }}>{submissionResult.testResults}</p>
                <div style={{ background: submissionResult.passed ? 'var(--success-bg)' : 'var(--warning-bg)', border: `1px solid ${submissionResult.passed ? 'var(--success)' : 'var(--warning)'}`, padding: '10px', borderRadius: '6px', marginTop: '8px' }}>{submissionResult.feedback}</div>
              </div>
            )}

            {optimizationResult && (
              <div style={{ marginBottom: '12px' }}>
                <h4>🤖 AI Optimization Analysis</h4>
                <div style={{ 
                  background: 'var(--bg)', 
                  padding: '12px', 
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {optimizationResult.qualityFeedback}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {optimizationResult.optimizationSuggestions}
                  </div>
                </div>
                {optimizationResult.codeExample && (
                  <div style={{ marginTop: '10px' }}>
                    <h5>💡 Optimization Example:</h5>
                    <pre style={{ 
                      background: 'var(--bg)', 
                      padding: '10px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace', 
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.8rem'
                    }}>
                      {optimizationResult.codeExample}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {!isLoading && !isAnalyzing && !submissionResult && !optimizationResult && (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                Submit your solution to see results or run Optimization after submitting.
              </div>
            )}
          </div>

          {/* Test Instructions */}
          <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '12px' }}>
            <h3>📋 Test Instructions</h3>
            <ul style={{ color: 'var(--muted)', paddingLeft: '20px' }}>
              <li>Write clean, efficient code that solves the problem</li>
              <li>Follow the provided function signature exactly</li>
              <li>Consider edge cases and constraints</li>
              <li>Use meaningful variable names</li>
              <li>Add comments for complex logic</li>
              <li>Test your solution with the provided examples</li>
              <li>Use the Optimization button for AI-powered code review</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
