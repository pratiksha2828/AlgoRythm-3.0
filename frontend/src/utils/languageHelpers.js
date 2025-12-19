/**
 * Shared utility functions for language helper generation
 */

/**
 * Parses comma-separated input with proper depth tracking for nested structures
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
    
    if (!inQuote && (char === '"' || char === "'") && prevChar !== '\\') {
      inQuote = true;
      quoteChar = char;
    } else if (inQuote && char === quoteChar && prevChar !== '\\') {
      inQuote = false;
    }
    
    if (!inQuote) {
      if (char === '[' || char === '{' || char === '(') depth++;
      if (char === ']' || char === '}' || char === ')') depth--;
    }
    
    if (char === ',' && depth === 0 && !inQuote) {
      const trimmed = current.trim();
      if (trimmed) results.push(trimmed);
      current = '';
    } else {
      current += char;
    }
  }
  
  const trimmed = current.trim();
  if (trimmed) results.push(trimmed);
  return results;
};

/**
 * Tree and List helper code for JavaScript
 */
export const getJavaScriptHelpers = () => ({
  treeNode: `
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function treeToArray(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}
`,
  listNode: `
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function buildList(arr) {
  if (!arr || arr.length === 0) return null;
  const dummy = new ListNode(0);
  let current = dummy;
  for (const val of arr) {
    current.next = new ListNode(val);
    current = current.next;
  }
  return dummy.next;
}
`
});

/**
 * Tree and List helper code for Python
 */
export const getPythonHelpers = () => `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_list(arr):
    if not arr:
        return None
    dummy = ListNode(0)
    current = dummy
    for val in arr:
        current.next = ListNode(val)
        current = current.next
    return dummy.next

def tree_to_array(root):
    if not root:
        return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None:
        result.pop()
    return result
`;

/**
 * Helper to get C/C++ headers and utilities
 */
export const getCCPPHelpers = () => `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <math.h>

#define MAX_SIZE 10000

// Helper function to parse array input
int* parseIntArray(const char* input, int* size) {
    static int arr[MAX_SIZE];
    *size = 0;
    const char* ptr = input;
    while (*ptr) {
        if (*ptr == '[' || *ptr == ']' || *ptr == ' ') {
            ptr++;
            continue;
        }
        if (*ptr == ',' || *ptr == '\\0') {
            ptr++;
            continue;
        }
        arr[(*size)++] = atoi(ptr);
        while (*ptr && *ptr != ',' && *ptr != ']') ptr++;
    }
    return arr;
}

// Helper to print array
void printArray(int* arr, int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("%d", arr[i]);
        if (i < size - 1) printf(",");
    }
    printf("]");
}

// Helper to compare arrays
bool arraysEqual(int* arr1, int size1, int* arr2, int size2) {
    if (size1 != size2) return false;
    for (int i = 0; i < size1; i++) {
        if (arr1[i] != arr2[i]) return false;
    }
    return true;
}
`;
