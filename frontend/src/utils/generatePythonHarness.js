/**
 * Python Test Harness Generator
 * Generates executable Python code with test cases
 */

import { parseInputString } from './parseInputString.js';
import { getPythonHelpers } from './languageHelpers.js';

/**
 * Normalizes Python indentation to ensure consistent 4-space indentation
 */
const normalizePythonIndentation = (code) => {
  const lines = code.split('\n');
  const normalizedLines = [];
  
  for (let line of lines) {
    // Convert tabs to 4 spaces
    const normalizedLine = line.replace(/\t/g, '    ');
    normalizedLines.push(normalizedLine);
  }
  
  return normalizedLines.join('\n');
};

/**
 * Generates Python test harness with test cases
 * @param {string} normalizedCode - User's normalized code
 * @param {string} functionName - Function name to test
 * @param {Array} validTestCases - Array of test cases
 * @param {Object} questionData - Question data with problem description
 * @returns {string} - Executable Python code
 */
export const generatePythonHarness = (normalizedCode, functionName, validTestCases, questionData) => {
  // Normalize Python indentation
  const pythonNormalizedCode = normalizePythonIndentation(normalizedCode);
  
  // Check if this is a tree or linked list problem
  const isTreeOrLinkedListProblemFlag = /tree|node|root|left|right|head|next|listnode/i.test(questionData?.problem || '') ||
                                        /tree|node|root|left|right|head|next|listnode/i.test(normalizedCode || '');
  
  // Get Python helpers
  const pythonHelpers = isTreeOrLinkedListProblemFlag ? getPythonHelpers() : '';
  
  // Generate test harness
  const harness = `
${pythonHelpers}
${pythonNormalizedCode}

# Test runner
print("=== TEST RESULTS ===")
solution = Solution() if 'Solution' in dir() else None

${validTestCases.map((testCase, index) => {
  const inputStr = typeof testCase.input === 'string' ? testCase.input : '';
  let expected = testCase.expected;
  
  // Convert expected value to Python format
  let expectedPython;
  if (expected === true) {
    expectedPython = 'True';
  } else if (expected === false) {
    expectedPython = 'False';
  } else if (expected === null) {
    expectedPython = 'None';
  } else if (typeof expected === 'string') {
    expectedPython = JSON.stringify(expected);
  } else if (typeof expected === 'number') {
    expectedPython = String(expected);
  } else {
    try {
      expectedPython = JSON.stringify(expected);
    } catch (parseError) {
      console.error('Failed to stringify expected value:', parseError);
      expectedPython = String(expected);
    }
  }
  
  // Process input
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
          assignments.push(`${varName} = build_tree(${value})`);
          funcArgs.push(varName);
          return;
        } else if (/head|list|l1|l2/i.test(varName)) {
          assignments.push(`${varName} = build_list(${value})`);
          funcArgs.push(varName);
          return;
        }
      }
      
      const sanitized = trimmed.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s+([a-zA-Z_])/g, '$1_$2');
      assignments.push(sanitized);
      const varName = sanitized.split('=')[0].trim();
      if (varName) funcArgs.push(varName);
    });
    
    return { assignments, funcArgs };
  };
  
  const { assignments, funcArgs } = processTestInput(inputStr, isTreeOrLinkedListProblemFlag);
  
  const expectedPythonEscaped = expectedPython.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const expectedIsArray = Array.isArray(expected);
  const expectedIsArrayPython = expectedIsArray ? 'True' : 'False';
  
  return `  try:
    import json
    ${assignments.join('\n    ')}
    # Try calling as a method of Solution class, fallback to standalone function
    try:
      result = solution.${functionName}(${funcArgs.join(', ')})
    except (AttributeError, NameError):
      result = ${functionName}(${funcArgs.join(', ')})
    
    # Parse expected value
    expected_str = "${expectedPythonEscaped}"
    try:
      expected = json.loads(expected_str)
    except:
      if expected_str.strip() in ['True', 'true']:
        expected = True
      elif expected_str.strip() in ['False', 'false']:
        expected = False
      elif expected_str.strip() in ['None', 'null']:
        expected = None
      else:
        try:
          expected = eval(expected_str)
        except:
          expected = expected_str
    
    # Convert tree result to array if needed
    if hasattr(result, 'val') and ${expectedIsArrayPython}:
      result = tree_to_array(result)
    
    # Compare results
    passed = json.dumps(result, sort_keys=True) == json.dumps(expected, sort_keys=True)
    print(json.dumps({"test": ${index + 1}, "status": "PASS" if passed else "FAIL"}))
except Exception as e:
    print(json.dumps({"test": ${index + 1}, "status": "ERROR", "error": str(e)}))
`;
}).join('')}
print("=== EXECUTION COMPLETE ===")
`;

  return harness.replace(/\r\n/g, '\n');
};
