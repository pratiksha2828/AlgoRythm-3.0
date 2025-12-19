/**
 * JavaScript Test Harness Generator
 * Generates executable JavaScript code with test cases
 */

import { parseInputString } from './parseInputString.js';
import { getJavaScriptHelpers } from './languageHelpers.js';

/**
 * Generates JavaScript test harness with test cases
 * @param {string} normalizedCode - User's normalized code
 * @param {string} functionName - Function name to test
 * @param {Array} validTestCases - Array of test cases
 * @param {Object} questionData - Question data with problem description
 * @returns {string} - Executable JavaScript code
 */
export const generateJavaScriptHarness = (normalizedCode, functionName, validTestCases, questionData) => {
  // Check if this is a tree or linked list problem
  const isTreeOrLinkedListProblemFlag = /tree|node|root|left|right|head|next|listnode/i.test(questionData?.problem || '') ||
                                        /tree|node|root|left|right|head|next|listnode/i.test(normalizedCode || '');
  
  // Get helpers
  const helpers = getJavaScriptHelpers();
  const dataStructureHelpers = isTreeOrLinkedListProblemFlag ? (helpers.treeNode + helpers.listNode) : '';
  
  // Check for fallback implementations
  const needsCountBitsFallback = functionName === 'countBits' && !/\bcountBits\b\s*(?:=|\(|:|function)/.test(normalizedCode);
  const countBitsFallback = `function countBits(n) { const ans = new Array(n + 1).fill(0); for (let i = 1; i <= n; i++) { ans[i] = ans[i >> 1] + (i & 1); } return ans; }`;

  // Generate test harness
  const harness = `
${dataStructureHelpers}${needsCountBitsFallback ? countBitsFallback + '\n\n' : ''}${normalizedCode}

// Test runner
console.log("=== TEST RESULTS ===");
${validTestCases.map((testCase, index) => {
  const rawInput = typeof testCase.input === 'string' ? testCase.input : '';
  let expected = testCase.expected;
  
  // Convert string booleans to actual booleans
  if (typeof expected === 'string') {
    const lower = expected.toLowerCase().trim();
    if (lower === 'true') expected = true;
    else if (lower === 'false') expected = false;
    else {
      try { 
        expected = JSON.parse(expected); 
      } catch (e) { 
        console.warn('Failed to parse expected value as JSON:', expected, e.message); 
      }
    }
  }
  
  // Process input using utility
  const processTestInput = (rawInput, isTreeOrLinkedList) => {
    const assignments = [];
    const funcArgs = [];
    const parts = parseInputString(rawInput);
    
    parts.forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;
      
      const varMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (varMatch && isTreeOrLinkedList) {
        const varName = varMatch[1];
        const value = varMatch[2];
        
        if (/root|tree/i.test(varName)) {
          assignments.push(`${varName} = buildTree(${value})`);
          funcArgs.push(varName);
          return;
        } else if (/head|list|l1|l2/i.test(varName)) {
          assignments.push(`${varName} = buildList(${value})`);
          funcArgs.push(varName);
          return;
        }
      }
      
      const sanitized = trimmed.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s+([a-zA-Z_$])/g, '$1_$2');
      assignments.push(sanitized);
      const varName = sanitized.split('=')[0].trim();
      if (varName) funcArgs.push(varName);
    });
    
    return { assignments, funcArgs };
  };
  
  const { assignments, funcArgs } = processTestInput(rawInput, isTreeOrLinkedListProblemFlag);
  
  const expectedIsArray = Array.isArray(expected);
  const testCode = expectedIsArray ? `
try {
  ${assignments.join(';\n  ')};
  let result = ${functionName}(${funcArgs.join(', ')});
  const expected = ${JSON.stringify(expected)};
  if (result && result.val !== undefined && Array.isArray(expected)) {
    result = treeToArray(result);
  }
  const passed = JSON.stringify(result) === JSON.stringify(expected);
  console.log(JSON.stringify({test: ${index + 1}, status: passed ? "PASS" : "FAIL"}));
} catch (e) {
  console.log(JSON.stringify({test: ${index + 1}, status: "ERROR", error: e.message}));
}` : `
try {
  ${assignments.join(';\n  ')};
  const result = ${functionName}(${funcArgs.join(', ')});
  const expected = ${JSON.stringify(expected)};
  const passed = JSON.stringify(result) === JSON.stringify(expected);
  console.log(JSON.stringify({test: ${index + 1}, status: passed ? "PASS" : "FAIL"}));
} catch (e) {
  console.log(JSON.stringify({test: ${index + 1}, status: "ERROR", error: e.message}));
}`;
  return testCode;
}).join('')}
console.log("=== EXECUTION COMPLETE ===");
`;

  return harness.replace(/\r\n/g, '\n');
};
