/**
 * Input String Parser Utility
 * Parses comma-separated input strings while respecting brackets and quotes
 */

/**
 * Parses an input string into an array of parts, respecting:
 * - Nested brackets/braces/parentheses
 * - Quoted strings
 * - Escaped characters
 * 
 * @param {string} str - Input string to parse
 * @returns {Array<string>} - Array of parsed parts
 * 
 * @example
 * parseInputString('nums=[1,2,3], target=5')
 * // Returns: ['nums=[1,2,3]', 'target=5']
 * 
 * @example
 * parseInputString('str="hello, world", count=3')
 * // Returns: ['str="hello, world"', 'count=3']
 */
export const parseInputString = (str) => {
  if (!str || typeof str !== 'string') return [];
  
  const results = [];
  let current = '';
  let depth = 0;
  let inQuote = false;
  let quoteChar = null;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : '';
    
    // Track quote state
    if (!inQuote && (char === '"' || char === "'") && prevChar !== '\\') {
      inQuote = true;
      quoteChar = char;
    } else if (inQuote && char === quoteChar && prevChar !== '\\') {
      inQuote = false;
    }
    
    // Track bracket/brace depth
    if (!inQuote) {
      if (char === '[' || char === '{' || char === '(') depth++;
      if (char === ']' || char === '}' || char === ')') depth--;
    }
    
    // Split on commas at depth 0 and outside quotes
    if (char === ',' && depth === 0 && !inQuote) {
      const trimmed = current.trim();
      if (trimmed) results.push(trimmed);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add final part
  const trimmed = current.trim();
  if (trimmed) results.push(trimmed);
  
  return results;
};
