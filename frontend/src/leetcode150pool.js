export const leetcode150Pool = {
  easy: [
    {
      id: 'two-sum',
      difficulty: 'easy',
      problem: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      exampleInput: 'nums = [2,7,11,15], target = 9',
      expectedOutput: '[0,1]',
      functionSignature: 'function twoSum(nums, target) { }',
      constraints: '2 <= nums.length <= 10^4; -10^9 <= nums[i] <= 10^9; -10^9 <= target <= 10^9',
      testCases: [
        { input: 'nums=[2,7,11,15], target=9', expected: '[0,1]', description: 'basic' },
        { input: 'nums=[3,2,4], target=6', expected: '[1,2]', description: 'different indices' }
      ]
    },
    {
      id: 'valid-parentheses',
      difficulty: 'easy',
      problem: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
      exampleInput: 's = "()[]{}"',
      expectedOutput: 'true',
      functionSignature: 'function isValid(s) { }',
      constraints: '1 <= s.length <= 10^4; s consists of parentheses only "()[]{}"',
      testCases: [
        { input: 's="()[]{}"', expected: 'true', description: 'valid sequence' },
        { input: 's="(]"', expected: 'false', description: 'invalid sequence' }
      ]
    },
    {
      id: 'merge-two-sorted-lists',
      difficulty: 'easy',
      problem: 'Merge two sorted linked lists and return it as a sorted list.',
      exampleInput: 'l1 = [1,2,4], l2 = [1,3,4]',
      expectedOutput: '[1,1,2,3,4,4]',
      functionSignature: 'function mergeTwoLists(l1, l2) { }',
      constraints: 'The number of nodes in both lists is in the range [0, 50]',
      testCases: [
        { input: 'l1=[1,2,4], l2=[1,3,4]', expected: '[1,1,2,3,4,4]', description: 'basic merge' }
      ]
    },
    {
      id: 'best-time-to-buy-sell-stock',
      difficulty: 'easy',
      problem: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
      exampleInput: 'prices = [7,1,5,3,6,4]',
      expectedOutput: '5',
      functionSignature: 'function maxProfit(prices) { }',
      constraints: '1 <= prices.length <= 10^5; 0 <= prices[i] <= 10^4',
      testCases: [
        { input: 'prices=[7,1,5,3,6,4]', expected: '5', description: 'buy at 1, sell at 6' }
      ]
    },
    {
      id: 'valid-palindrome',
      difficulty: 'easy',
      problem: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
      exampleInput: 's = "A man, a plan, a canal: Panama"',
      expectedOutput: 'true',
      functionSignature: 'function isPalindrome(s) { }',
      constraints: '1 <= s.length <= 2 * 10^5; s consists only of printable ASCII characters',
      testCases: [
        { input: 's="A man, a plan, a canal: Panama"', expected: 'true', description: 'valid palindrome' },
        { input: 's="race a car"', expected: 'false', description: 'not palindrome' }
      ]
    },
    {
      id: 'reverse-linked-list',
      difficulty: 'easy',
      problem: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      exampleInput: 'head = [1,2,3,4,5]',
      expectedOutput: '[5,4,3,2,1]',
      functionSignature: 'function reverseList(head) { }',
      constraints: 'The number of nodes in the list is the range [0, 5000]',
      testCases: [
        { input: 'head=[1,2,3,4,5]', expected: '[5,4,3,2,1]', description: 'reverse list' }
      ]
    },
    {
      id: 'contains-duplicate',
      difficulty: 'easy',
      problem: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
      exampleInput: 'nums = [1,2,3,1]',
      expectedOutput: 'true',
      functionSignature: 'function containsDuplicate(nums) { }',
      constraints: '1 <= nums.length <= 10^5; -10^9 <= nums[i] <= 10^9',
      testCases: [
        { input: 'nums=[1,2,3,1]', expected: 'true', description: 'has duplicates' },
        { input: 'nums=[1,2,3,4]', expected: 'false', description: 'all unique' }
      ]
    },
    {
      id: 'invert-binary-tree',
      difficulty: 'easy',
      problem: 'Given the root of a binary tree, invert the tree, and return its root.',
      exampleInput: 'root = [4,2,7,1,3,6,9]',
      expectedOutput: '[4,7,2,9,6,3,1]',
      functionSignature: 'function invertTree(root) { }',
      constraints: 'The number of nodes in the tree is in the range [0, 100]',
      testCases: [
        { input: 'root=[4,2,7,1,3,6,9]', expected: '[4,7,2,9,6,3,1]', description: 'invert tree' }
      ]
    },
    {
      id: 'maximum-subarray',
      difficulty: 'easy',
      problem: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
      exampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
      expectedOutput: '6',
      functionSignature: 'function maxSubArray(nums) { }',
      constraints: '1 <= nums.length <= 10^5; -10^4 <= nums[i] <= 10^4',
      testCases: [
        { input: 'nums=[-2,1,-3,4,-1,2,1,-5,4]', expected: '6', description: 'maximum subarray sum' }
      ]
    },
    {
      id: 'linked-list-cycle',
      difficulty: 'easy',
      problem: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
      exampleInput: 'head = [3,2,0,-4], pos = 1',
      expectedOutput: 'true',
      functionSignature: 'function hasCycle(head) { }',
      constraints: 'The number of the nodes in the list is in the range [0, 10^4]',
      testCases: [
        { input: 'head=[3,2,0,-4], cycle at index 1', expected: 'true', description: 'has cycle' }
      ]
    },
    {
      id: 'implement-queue-using-stacks',
      difficulty: 'easy',
      problem: 'Implement a first in first out (FIFO) queue using only two stacks.',
      exampleInput: 'MyQueue queue = new MyQueue(); queue.push(1); queue.push(2); queue.peek(); queue.pop();',
      expectedOutput: '1, 1',
      functionSignature: 'class MyQueue { constructor() {}; push(x) {}; pop() {}; peek() {}; empty() {}; }',
      constraints: '1 <= x <= 9; At most 100 calls will be made to push, pop, peek, and empty',
      testCases: [
        { input: 'push(1), push(2), peek(), pop(), empty()', expected: '1, 1, false', description: 'queue operations' }
      ]
    },
    {
      id: 'first-bad-version',
      difficulty: 'easy',
      problem: 'You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad. Suppose you have n versions [1, 2, ..., n] and you want to find out the first bad one. Note: You should define isBadVersion(n) in your solution to simulate the API.',
      exampleInput: 'n = 5',
      expectedOutput: '4',
      functionSignature: 'function firstBadVersion(n) { }',
      constraints: '1 <= bad <= n <= 2^31 - 1',
      testCases: [
        { input: 'n=5', expected: '4', description: 'find first bad version (assuming bad version is 4)' }
      ]
    },
    {
      id: 'ransom-note',
      difficulty: 'easy',
      problem: 'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise.',
      exampleInput: 'ransomNote = "a", magazine = "b"',
      expectedOutput: 'false',
      functionSignature: 'function canConstruct(ransomNote, magazine) { }',
      constraints: '1 <= ransomNote.length, magazine.length <= 10^5',
      testCases: [
        { input: 'ransomNote="a", magazine="b"', expected: 'false', description: 'cannot construct' },
        { input: 'ransomNote="aa", magazine="aab"', expected: 'true', description: 'can construct' }
      ]
    },
    {
      id: 'climbing-stairs',
      difficulty: 'easy',
      problem: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      exampleInput: 'n = 3',
      expectedOutput: '3',
      functionSignature: 'function climbStairs(n) { }',
      constraints: '1 <= n <= 45',
      testCases: [
        { input: 'n=2', expected: '2', description: '2 steps' },
        { input: 'n=3', expected: '3', description: '3 steps' }
      ]
    },
    {
      id: 'longest-common-prefix',
      difficulty: 'easy',
      problem: 'Write a function to find the longest common prefix string amongst an array of strings.',
      exampleInput: 'strs = ["flower","flow","flight"]',
      expectedOutput: '"fl"',
      functionSignature: 'function longestCommonPrefix(strs) { }',
      constraints: '1 <= strs.length <= 200; 0 <= strs[i].length <= 200',
      testCases: [
        { input: 'strs=["flower","flow","flight"]', expected: '"fl"', description: 'common prefix' }
      ]
    },
    {
      id: 'binary-search',
      difficulty: 'easy',
      problem: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
      exampleInput: 'nums = [-1,0,3,5,9,12], target = 9',
      expectedOutput: '4',
      functionSignature: 'function search(nums, target) { }',
      constraints: '1 <= nums.length <= 10^4; -10^4 < nums[i], target < 10^4',
      testCases: [
        { input: 'nums=[-1,0,3,5,9,12], target=9', expected: '4', description: 'target found' },
        { input: 'nums=[-1,0,3,5,9,12], target=2', expected: '-1', description: 'target not found' }
      ]
    },
    {
      id: 'flood-fill',
      difficulty: 'easy',
      problem: 'An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are also given three integers sr, sc, and newColor. You should perform a flood fill on the image starting from the pixel image[sr][sc].',
      exampleInput: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, newColor = 2',
      expectedOutput: '[[2,2,2],[2,2,0],[2,0,1]]',
      functionSignature: 'function floodFill(image, sr, sc, newColor) { }',
      constraints: 'm == image.length; n == image[i].length; 1 <= m, n <= 50',
      testCases: [
        { input: 'image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, newColor=2', expected: '[[2,2,2],[2,2,0],[2,0,1]]', description: 'flood fill' }
      ]
    },
    {
      id: 'balanced-binary-tree',
      difficulty: 'easy',
      problem: 'Given a binary tree, determine if it is height-balanced. For this problem, a height-balanced binary tree is defined as: a binary tree in which the left and right subtrees of every node differ in height by no more than 1.',
      exampleInput: 'root = [3,9,20,null,null,15,7]',
      expectedOutput: 'true',
      functionSignature: 'function isBalanced(root) { }',
      constraints: 'The number of nodes in the tree is in the range [0, 5000]',
      testCases: [
        { input: 'root=[3,9,20,null,null,15,7]', expected: 'true', description: 'balanced tree' },
        { input: 'root=[1,2,2,3,3,null,null,4,4]', expected: 'false', description: 'unbalanced tree' }
      ]
    },
    {
      id: 'convert-sorted-array-to-bst',
      difficulty: 'easy',
      problem: 'Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.',
      exampleInput: 'nums = [-10,-3,0,5,9]',
      expectedOutput: '[0,-3,9,-10,null,5]',
      functionSignature: 'function sortedArrayToBST(nums) { }',
      constraints: '1 <= nums.length <= 10^4; -10^4 <= nums[i] <= 10^4',
      testCases: [
        { input: 'nums=[-10,-3,0,5,9]', expected: '[0,-3,9,-10,null,5]', description: 'sorted array to BST' }
      ]
    },
    {
      id: 'subtree-of-another-tree',
      difficulty: 'easy',
      problem: 'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.',
      exampleInput: 'root = [3,4,5,1,2], subRoot = [4,1,2]',
      expectedOutput: 'true',
      functionSignature: 'function isSubtree(root, subRoot) { }',
      constraints: 'The number of nodes in the root tree is in the range [1, 2000]',
      testCases: [
        { input: 'root=[3,4,5,1,2], subRoot=[4,1,2]', expected: 'true', description: 'is subtree' }
      ]
    },
    {
      id: 'squares-of-sorted-array',
      difficulty: 'easy',
      problem: 'Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.',
      exampleInput: 'nums = [-4,-1,0,3,10]',
      expectedOutput: '[0,1,9,16,100]',
      functionSignature: 'function sortedSquares(nums) { }',
      constraints: '1 <= nums.length <= 10^4; -10^4 <= nums[i] <= 10^4',
      testCases: [
        { input: 'nums=[-4,-1,0,3,10]', expected: '[0,1,9,16,100]', description: 'squares sorted' }
      ]
    },
    {
      id: 'backspace-string-compare',
      difficulty: 'easy',
      problem: 'Given two strings s and t, return true if they are equal when both are typed into empty text editors. "#" means a backspace character.',
      exampleInput: 's = "ab#c", t = "ad#c"',
      expectedOutput: 'true',
      functionSignature: 'function backspaceCompare(s, t) { }',
      constraints: '1 <= s.length, t.length <= 200; s and t only contain lowercase letters and "#" characters.',
      testCases: [
        { input: 's="ab#c", t="ad#c"', expected: 'true', description: 'equal after backspace' },
        { input: 's="a##c", t="#a#c"', expected: 'true', description: 'both become "c"' }
      ]
    },
    {
      id: 'diameter-of-binary-tree',
      difficulty: 'easy',
      problem: 'Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree.',
      exampleInput: 'root = [1,2,3,4,5]',
      expectedOutput: '3',
      functionSignature: 'function diameterOfBinaryTree(root) { }',
      constraints: 'The number of nodes in the tree is in the range [1, 10^4]',
      testCases: [
        { input: 'root=[1,2,3,4,5]', expected: '3', description: 'diameter of tree' }
      ]
    },
    {
      id: 'last-stone-weight',
      difficulty: 'easy',
      problem: 'We have a collection of stones, each stone has a positive integer weight. Each turn, we choose the two heaviest stones and smash them together. If the stones are of weight x and y with x <= y, the result of this smash is: if x == y, both stones are destroyed; if x != y, the stone of weight x is destroyed, and the stone of weight y has new weight y-x.',
      exampleInput: 'stones = [2,7,4,1,8,1]',
      expectedOutput: '1',
      functionSignature: 'function lastStoneWeight(stones) { }',
      constraints: '1 <= stones.length <= 30; 1 <= stones[i] <= 1000',
      testCases: [
        { input: 'stones=[2,7,4,1,8,1]', expected: '1', description: 'last stone weight' }
      ]
    },
    {
      id: 'counting-bits',
      difficulty: 'easy',
      problem: 'Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1\'s in the binary representation of i.',
      exampleInput: 'n = 5',
      expectedOutput: '[0,1,1,2,1,2]',
      functionSignature: 'function countBits(n) { }',
      constraints: '0 <= n <= 10^5',
      testCases: [
        { input: 'n=5', expected: '[0,1,1,2,1,2]', description: 'counting bits' }
      ]
    },
    {
      id: 'majority-element',
      difficulty: 'easy',
      problem: 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.',
      exampleInput: 'nums = [2,2,1,1,1,2,2]',
      expectedOutput: '2',
      functionSignature: 'function majorityElement(nums) { }',
      constraints: 'n == nums.length; 1 <= n <= 5 * 10^4; -10^9 <= nums[i] <= 10^9',
      testCases: [
        { input: 'nums=[2,2,1,1,1,2,2]', expected: '2', description: 'majority element' }
      ]
    },
    {
      id: 'move-zeroes',
      difficulty: 'easy',
      problem: 'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements.',
      exampleInput: 'nums = [0,1,0,3,12]',
      expectedOutput: '[1,3,12,0,0]',
      functionSignature: 'function moveZeroes(nums) { }',
      constraints: '1 <= nums.length <= 10^4; -2^31 <= nums[i] <= 2^31 - 1',
      testCases: [
        { input: 'nums=[0,1,0,3,12]', expected: '[1,3,12,0,0]', description: 'move zeroes' }
      ]
    },
    {
      id: 'power-of-two',
      difficulty: 'easy',
      problem: 'Given an integer n, return true if it is a power of two. Otherwise, return false.',
      exampleInput: 'n = 16',
      expectedOutput: 'true',
      functionSignature: 'function isPowerOfTwo(n) { }',
      constraints: '-2^31 <= n <= 2^31 - 1',
      testCases: [
        { input: 'n=16', expected: 'true', description: 'power of two' },
        { input: 'n=3', expected: 'false', description: 'not power of two' }
      ]
    }
  ],
  medium: [
    {
      id: 'add-two-numbers',
      difficulty: 'medium',
      problem: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
      exampleInput: 'l1 = [2,4,3], l2 = [5,6,4]',
      expectedOutput: '[7,0,8]',
      functionSignature: 'function addTwoNumbers(l1, l2) { }',
      constraints: 'The number of nodes in each linked list is in the range [1, 100]',
      testCases: [
        { input: 'l1=[2,4,3], l2=[5,6,4]', expected: '[7,0,8]', description: 'basic addition' }
      ]
    },
    {
      id: 'longest-substring-without-repeating',
      difficulty: 'medium',
      problem: 'Given a string s, find the length of the longest substring without repeating characters.',
      exampleInput: 's = "abcabcbb"',
      expectedOutput: '3',
      functionSignature: 'function lengthOfLongestSubstring(s) { }',
      constraints: '0 <= s.length <= 5 * 10^4; s consists of English letters, digits, symbols and spaces',
      testCases: [
        { input: 's="abcabcbb"', expected: '3', description: 'longest is "abc"' },
        { input: 's="bbbbb"', expected: '1', description: 'all same characters' }
      ]
    },
    {
      id: 'container-with-most-water',
      difficulty: 'medium',
      problem: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.',
      exampleInput: 'height = [1,8,6,2,5,4,8,3,7]',
      expectedOutput: '49',
      functionSignature: 'function maxArea(height) { }',
      constraints: 'n == height.length; 2 <= n <= 10^5; 0 <= height[i] <= 10^4',
      testCases: [
        { input: 'height=[1,8,6,2,5,4,8,3,7]', expected: '49', description: 'maximum area between indices 1 and 8' }
      ]
    },
    {
      id: 'three-sum',
      difficulty: 'medium',
      problem: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
      exampleInput: 'nums = [-1,0,1,2,-1,-4]',
      expectedOutput: '[[-1,-1,2],[-1,0,1]]',
      functionSignature: 'function threeSum(nums) { }',
      constraints: '3 <= nums.length <= 3000; -10^5 <= nums[i] <= 10^5',
      testCases: [
        { input: 'nums=[-1,0,1,2,-1,-4]', expected: '[[-1,-1,2],[-1,0,1]]', description: 'multiple triplets' }
      ]
    },
    {
      id: 'letter-combinations-phone',
      difficulty: 'medium',
      problem: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.',
      exampleInput: 'digits = "23"',
      expectedOutput: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
      functionSignature: 'function letterCombinations(digits) { }',
      constraints: '0 <= digits.length <= 4; digits[i] is a digit in the range [2, 9]',
      testCases: [
        { input: 'digits="23"', expected: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', description: 'phone pad combinations' }
      ]
    },
    {
      id: 'remove-nth-node-from-end',
      difficulty: 'medium',
      problem: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
      exampleInput: 'head = [1,2,3,4,5], n = 2',
      expectedOutput: '[1,2,3,5]',
      functionSignature: 'function removeNthFromEnd(head, n) { }',
      constraints: 'The number of nodes in the list is sz; 1 <= sz <= 30; 0 <= n <= sz',
      testCases: [
        { input: 'head=[1,2,3,4,5], n=2', expected: '[1,2,3,5]', description: 'remove 2nd from end' }
      ]
    },
    {
      id: 'generate-parentheses',
      difficulty: 'medium',
      problem: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
      exampleInput: 'n = 3',
      expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]',
      functionSignature: 'function generateParenthesis(n) { }',
      constraints: '1 <= n <= 8',
      testCases: [
        { input: 'n=3', expected: '["((()))","(()())","(())()","()(())","()()()"]', description: 'generate valid parentheses' }
      ]
    },
    {
      id: 'search-in-rotated-sorted-array',
      difficulty: 'medium',
      problem: 'There is an integer array nums sorted in ascending order (with distinct values). Given the array after possible rotation and an integer target, return the index of target if it is in nums, or -1 otherwise.',
      exampleInput: 'nums = [4,5,6,7,0,1,2], target = 0',
      expectedOutput: '4',
      functionSignature: 'function search(nums, target) { }',
      constraints: '1 <= nums.length <= 5000; -10^4 <= nums[i] <= 10^4',
      testCases: [
        { input: 'nums=[4,5,6,7,0,1,2], target=0', expected: '4', description: 'find in rotated array' }
      ]
    },
    {
      id: 'combination-sum',
      difficulty: 'medium',
      problem: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.',
      exampleInput: 'candidates = [2,3,6,7], target = 7',
      expectedOutput: '[[2,2,3],[7]]',
      functionSignature: 'function combinationSum(candidates, target) { }',
      constraints: '1 <= candidates.length <= 30; 1 <= candidates[i] <= 200',
      testCases: [
        { input: 'candidates=[2,3,6,7], target=7', expected: '[[2,2,3],[7]]', description: 'combination sum' }
      ]
    },
    {
      id: 'permutations',
      difficulty: 'medium',
      problem: 'Given an array nums of distinct integers, return all the possible permutations.',
      exampleInput: 'nums = [1,2,3]',
      expectedOutput: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      functionSignature: 'function permute(nums) { }',
      constraints: '1 <= nums.length <= 6; -10 <= nums[i] <= 10',
      testCases: [
        { input: 'nums=[1,2,3]', expected: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', description: 'all permutations' }
      ]
    },
    {
      id: 'merge-intervals',
      difficulty: 'medium',
      problem: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
      exampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
      expectedOutput: '[[1,6],[8,10],[15,18]]',
      functionSignature: 'function merge(intervals) { }',
      constraints: '1 <= intervals.length <= 10^4; intervals[i].length == 2',
      testCases: [
        { input: 'intervals=[[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]', description: 'merge overlapping' }
      ]
    },
    {
      id: 'unique-paths',
      difficulty: 'medium',
      problem: 'There is a robot on an m x n grid. The robot starts at the top-left corner. The robot can only move either down or right at any point in time. How many possible unique paths are there to reach the bottom-right corner?',
      exampleInput: 'm = 3, n = 7',
      expectedOutput: '28',
      functionSignature: 'function uniquePaths(m, n) { }',
      constraints: '1 <= m, n <= 100',
      testCases: [
        { input: 'm=3, n=7', expected: '28', description: 'unique paths count' }
      ]
    },
    {
      id: 'set-matrix-zeroes',
      difficulty: 'medium',
      problem: 'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0\'s.',
      exampleInput: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]',
      expectedOutput: '[[1,0,1],[0,0,0],[1,0,1]]',
      functionSignature: 'function setZeroes(matrix) { }',
      constraints: 'm == matrix.length; n == matrix[0].length; 1 <= m, n <= 200',
      testCases: [
        { input: 'matrix=[[1,1,1],[1,0,1],[1,1,1]]', expected: '[[1,0,1],[0,0,0],[1,0,1]]', description: 'set rows and columns to zero' }
      ]
    },
    {
      id: 'word-search',
      difficulty: 'medium',
      problem: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.',
      exampleInput: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
      expectedOutput: 'true',
      functionSignature: 'function exist(board, word) { }',
      constraints: 'm == board.length; n = board[i].length; 1 <= m, n <= 6; 1 <= word.length <= 15',
      testCases: [
        { input: 'board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"', expected: 'true', description: 'word exists in grid' }
      ]
    },
    {
      id: 'binary-tree-level-order',
      difficulty: 'medium',
      problem: 'Given the root of a binary tree, return the level order traversal of its nodes\' values.',
      exampleInput: 'root = [3,9,20,null,null,15,7]',
      expectedOutput: '[[3],[9,20],[15,7]]',
      functionSignature: 'function levelOrder(root) { }',
      constraints: 'The number of nodes in the tree is in the range [0, 2000]',
      testCases: [
        { input: 'root=[3,9,20,null,null,15,7]', expected: '[[3],[9,20],[15,7]]', description: 'level order traversal' }
      ]
    },
    {
      id: 'maximum-product-subarray',
      difficulty: 'medium',
      problem: 'Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.',
      exampleInput: 'nums = [2,3,-2,4]',
      expectedOutput: '6',
      functionSignature: 'function maxProduct(nums) { }',
      constraints: '1 <= nums.length <= 2 * 10^4; -10 <= nums[i] <= 10',
      testCases: [
        { input: 'nums=[2,3,-2,4]', expected: '6', description: 'maximum product subarray' }
      ]
    },
    {
      id: 'find-minimum-in-rotated-sorted-array',
      difficulty: 'medium',
      problem: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.',
      exampleInput: 'nums = [3,4,5,1,2]',
      expectedOutput: '1',
      functionSignature: 'function findMin(nums) { }',
      constraints: 'n == nums.length; 1 <= n <= 5000; -5000 <= nums[i] <= 5000',
      testCases: [
        { input: 'nums=[3,4,5,1,2]', expected: '1', description: 'find minimum in rotated array' }
      ]
    },
    {
      id: 'house-robber',
      difficulty: 'medium',
      problem: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
      exampleInput: 'nums = [1,2,3,1]',
      expectedOutput: '4',
      functionSignature: 'function rob(nums) { }',
      constraints: '1 <= nums.length <= 100; 0 <= nums[i] <= 400',
      testCases: [
        { input: 'nums=[1,2,3,1]', expected: '4', description: 'rob houses' }
      ]
    },
    {
      id: 'number-of-islands',
      difficulty: 'medium',
      problem: 'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
      exampleInput: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
      expectedOutput: '1',
      functionSignature: 'function numIslands(grid) { }',
      constraints: 'm == grid.length; n == grid[i].length; 1 <= m, n <= 300',
      testCases: [
        { input: 'grid=[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expected: '1', description: 'one island' }
      ]
    },
    {
      id: 'reverse-integer',
      difficulty: 'medium',
      problem: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.',
      exampleInput: 'x = 123',
      expectedOutput: '321',
      functionSignature: 'function reverse(x) { }',
      constraints: '-2^31 <= x <= 2^31 - 1',
      testCases: [
        { input: 'x=123', expected: '321', description: 'reverse positive' },
        { input: 'x=-123', expected: '-321', description: 'reverse negative' }
      ]
    },
    {
      id: 'palindromic-substrings',
      difficulty: 'medium',
      problem: 'Given a string s, return the number of palindromic substrings in it.',
      exampleInput: 's = "abc"',
      expectedOutput: '3',
      functionSignature: 'function countSubstrings(s) { }',
      constraints: '1 <= s.length <= 1000; s consists of lowercase English letters',
      testCases: [
        { input: 's="abc"', expected: '3', description: 'three palindromic substrings' },
        { input: 's="aaa"', expected: '6', description: 'six palindromic substrings' }
      ]
    },
    {
      id: 'binary-tree-zigzag-level-order',
      difficulty: 'medium',
      problem: 'Given the root of a binary tree, return the zigzag level order traversal of its nodes\' values. (i.e., from left to right, then right to left for the next level and alternate between).',
      exampleInput: 'root = [3,9,20,null,null,15,7]',
      expectedOutput: '[[3],[20,9],[15,7]]',
      functionSignature: 'function zigzagLevelOrder(root) { }',
      constraints: 'The number of nodes in the tree is in the range [0, 2000]',
      testCases: [
        { input: 'root=[3,9,20,null,null,15,7]', expected: '[[3],[20,9],[15,7]]', description: 'zigzag level order' }
      ]
    },
    {
      id: 'construct-binary-tree-from-preorder-inorder',
      difficulty: 'medium',
      problem: 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.',
      exampleInput: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]',
      expectedOutput: '[3,9,20,null,null,15,7]',
      functionSignature: 'function buildTree(preorder, inorder) { }',
      constraints: '1 <= preorder.length <= 3000; inorder.length == preorder.length',
      testCases: [
        { input: 'preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]', expected: '[3,9,20,null,null,15,7]', description: 'build tree from traversals' }
      ]
    },
    {
      id: 'populating-next-right-pointers',
      difficulty: 'medium',
      problem: 'You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to NULL.',
      exampleInput: 'root = [1,2,3,4,5,6,7]',
      expectedOutput: '[1,#,2,3,#,4,5,6,7,#]',
      functionSignature: 'function connect(root) { }',
      constraints: 'The number of nodes in the tree is in the range [0, 2^12 - 1]',
      testCases: [
        { input: 'root=[1,2,3,4,5,6,7]', expected: '[1,#,2,3,#,4,5,6,7,#]', description: 'connect next pointers' }
      ]
    },
    {
      id: 'kth-smallest-element-in-bst',
      difficulty: 'medium',
      problem: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
      exampleInput: 'root = [3,1,4,null,2], k = 1',
      expectedOutput: '1',
      functionSignature: 'function kthSmallest(root, k) { }',
      constraints: 'The number of nodes in the tree is n; 1 <= k <= n <= 10^4',
      testCases: [
        { input: 'root=[3,1,4,null,2], k=1', expected: '1', description: 'kth smallest in BST' }
      ]
    },
    {
      id: 'task-scheduler',
      difficulty: 'medium',
      problem: 'Given a characters array tasks, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle. However, there is a non-negative integer n that represents the cooldown period between two same tasks. Return the least number of units of times that the CPU will take to finish all the given tasks.',
      exampleInput: 'tasks = ["A","A","A","B","B","B"], n = 2',
      expectedOutput: '8',
      functionSignature: 'function leastInterval(tasks, n) { }',
      constraints: '1 <= task.length <= 10^4; tasks[i] is upper-case English letter; 0 <= n <= 100',
      testCases: [
        { input: 'tasks=["A","A","A","B","B","B"], n=2', expected: '8', description: 'task scheduling' }
      ]
    },
    {
      id: 'lru-cache',
      difficulty: 'medium',
      problem: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
      exampleInput: 'LRUCache cache = new LRUCache(2); cache.put(1,1); cache.put(2,2); cache.get(1); cache.put(3,3); cache.get(2);',
      expectedOutput: '1, -1',
      functionSignature: 'class LRUCache { constructor(capacity) {}; get(key) {}; put(key, value) {}; }',
      constraints: '1 <= capacity <= 3000; 0 <= key <= 10^4; 0 <= value <= 10^5',
      testCases: [
        { input: 'capacity=2, put(1,1), put(2,2), get(1), put(3,3), get(2)', expected: '1, -1', description: 'LRU cache operations' }
      ]
    },
    {
      id: 'rotate-image',
      difficulty: 'medium',
      problem: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).',
      exampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
      expectedOutput: '[[7,4,1],[8,5,2],[9,6,3]]',
      functionSignature: 'function rotate(matrix) { }',
      constraints: 'n == matrix.length == matrix[i].length; 1 <= n <= 20',
      testCases: [
        { input: 'matrix=[[1,2,3],[4,5,6],[7,8,9]]', expected: '[[7,4,1],[8,5,2],[9,6,3]]', description: 'rotate image 90 degrees' }
      ]
    },
    {
      id: 'spiral-matrix',
      difficulty: 'medium',
      problem: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
      exampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
      expectedOutput: '[1,2,3,6,9,8,7,4,5]',
      functionSignature: 'function spiralOrder(matrix) { }',
      constraints: 'm == matrix.length; n == matrix[i].length; 1 <= m, n <= 10',
      testCases: [
        { input: 'matrix=[[1,2,3],[4,5,6],[7,8,9]]', expected: '[1,2,3,6,9,8,7,4,5]', description: 'spiral order traversal' }
      ]
    },
    {
      id: 'subsets',
      difficulty: 'medium',
      problem: 'Given an integer array nums of unique elements, return all possible subsets (the power set).',
      exampleInput: 'nums = [1,2,3]',
      expectedOutput: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
      functionSignature: 'function subsets(nums) { }',
      constraints: '1 <= nums.length <= 10; -10 <= nums[i] <= 10',
      testCases: [
        { input: 'nums=[1,2,3]', expected: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', description: 'all subsets' }
      ]
    },
    {
      id: 'sort-colors',
      difficulty: 'medium',
      problem: 'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.',
      exampleInput: 'nums = [2,0,2,1,1,0]',
      expectedOutput: '[0,0,1,1,2,2]',
      functionSignature: 'function sortColors(nums) { }',
      constraints: 'n == nums.length; 1 <= n <= 300',
      testCases: [
        { input: 'nums=[2,0,2,1,1,0]', expected: '[0,0,1,1,2,2]', description: 'sort colors' }
      ]
    },
    {
      id: 'word-break',
      difficulty: 'medium',
      problem: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
      exampleInput: 's = "leetcode", wordDict = ["leet","code"]',
      expectedOutput: 'true',
      functionSignature: 'function wordBreak(s, wordDict) { }',
      constraints: '1 <= s.length <= 300; 1 <= wordDict.length <= 1000; 1 <= wordDict[i].length <= 20',
      testCases: [
        { input: 's="leetcode", wordDict=["leet","code"]', expected: 'true', description: 'word break possible' }
      ]
    },
    {
      id: 'partition-equal-subset-sum',
      difficulty: 'medium',
      problem: 'Given a non-empty array nums containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.',
      exampleInput: 'nums = [1,5,11,5]',
      expectedOutput: 'true',
      functionSignature: 'function canPartition(nums) { }',
      constraints: '1 <= nums.length <= 200; 1 <= nums[i] <= 100',
      testCases: [
        { input: 'nums=[1,5,11,5]', expected: 'true', description: 'can partition equally' }
      ]
    },
    {
      id: 'string-to-integer-atoi',
      difficulty: 'medium',
      problem: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.',
      exampleInput: 's = "42"',
      expectedOutput: '42',
      functionSignature: 'function myAtoi(s) { }',
      constraints: '0 <= s.length <= 200; s consists of English letters, digits, " ", "+", "-", and "."',
      testCases: [
        { input: 's="42"', expected: '42', description: 'convert string to integer' },
        { input: 's="   -42"', expected: '-42', description: 'with whitespace and negative' }
      ]
    }
  ],
  hard: [
    {
      id: 'median-two-sorted-arrays',
      difficulty: 'hard',
      problem: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
      exampleInput: 'nums1 = [1,3], nums2 = [2]',
      expectedOutput: '2.0',
      functionSignature: 'function findMedianSortedArrays(nums1, nums2) { }',
      constraints: 'nums1.length == m; nums2.length == n; 0 <= m <= 1000; 0 <= n <= 1000',
      testCases: [
        { input: 'nums1=[1,3], nums2=[2]', expected: '2.0', description: 'odd total length' },
        { input: 'nums1=[1,2], nums2=[3,4]', expected: '2.5', description: 'even total length' }
      ]
    },
    {
      id: 'regular-expression-matching',
      difficulty: 'hard',
      problem: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*" where "." matches any single character and "*" matches zero or more of the preceding element.',
      exampleInput: 's = "aa", p = "a*"',
      expectedOutput: 'true',
      functionSignature: 'function isMatch(s, p) { }',
      constraints: '1 <= s.length <= 20; 1 <= p.length <= 30; s contains only lowercase English letters',
      testCases: [
        { input: 's="aa", p="a*"', expected: 'true', description: 'zero or more matching' }
      ]
    },
    {
      id: 'merge-k-sorted-lists',
      difficulty: 'hard',
      problem: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
      exampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
      expectedOutput: '[1,1,2,3,4,4,5,6]',
      functionSignature: 'function mergeKLists(lists) { }',
      constraints: 'k == lists.length; 0 <= k <= 10^4; 0 <= lists[i].length <= 500',
      testCases: [
        { input: 'lists=[[1,4,5],[1,3,4],[2,6]]', expected: '[1,1,2,3,4,4,5,6]', description: 'merge k sorted lists' }
      ]
    },
    {
      id: 'n-queens',
      difficulty: 'hard',
      problem: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.',
      exampleInput: 'n = 4',
      expectedOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
      functionSignature: 'function solveNQueens(n) { }',
      constraints: '1 <= n <= 9',
      testCases: [
        { input: 'n=4', expected: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', description: 'n-queens solutions' }
      ]
    },
    {
      id: 'trapping-rain-water',
      difficulty: 'hard',
      problem: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
      exampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
      expectedOutput: '6',
      functionSignature: 'function trap(height) { }',
      constraints: 'n == height.length; 1 <= n <= 2 * 10^4; 0 <= height[i] <= 10^5',
      testCases: [
        { input: 'height=[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6', description: 'trapped rain water' }
      ]
    },
    {
      id: 'sliding-window-maximum',
      difficulty: 'hard',
      problem: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Return the max sliding window.',
      exampleInput: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
      expectedOutput: '[3,3,5,5,6,7]',
      functionSignature: 'function maxSlidingWindow(nums, k) { }',
      constraints: '1 <= nums.length <= 10^5; -10^4 <= nums[i] <= 10^4; 1 <= k <= nums.length',
      testCases: [
        { input: 'nums=[1,3,-1,-3,5,3,6,7], k=3', expected: '[3,3,5,5,6,7]', description: 'sliding window maximum' }
      ]
    },
    {
      id: 'minimum-window-substring',
      difficulty: 'hard',
      problem: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
      exampleInput: 's = "ADOBECODEBANC", t = "ABC"',
      expectedOutput: '"BANC"',
      functionSignature: 'function minWindow(s, t) { }',
      constraints: 'm == s.length; n == t.length; 1 <= m, n <= 10^5; s and t consist of uppercase and lowercase English letters',
      testCases: [
        { input: 's="ADOBECODEBANC", t="ABC"', expected: '"BANC"', description: 'minimum window substring' }
      ]
    },
    {
      id: 'serialize-deserialize-binary-tree',
      difficulty: 'hard',
      problem: 'Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work.',
      exampleInput: 'root = [1,2,3,null,null,4,5]',
      expectedOutput: 'serialized string that can be deserialized to original tree',
      functionSignature: 'class Codec { serialize(root) {}; deserialize(data) {}; }',
      constraints: 'The number of nodes in the tree is in the range [0, 10^4]',
      testCases: [
        { input: 'root=[1,2,3,null,null,4,5]', expected: 'same tree after serialize/deserialize', description: 'serialize and deserialize' }
      ]
    },
    {
      id: 'word-ladder',
      difficulty: 'hard',
      problem: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words such that: adjacent words differ by exactly one letter, and each word in the sequence is in wordList. Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
      exampleInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
      expectedOutput: '5',
      functionSignature: 'function ladderLength(beginWord, endWord, wordList) { }',
      constraints: '1 <= beginWord.length <= 10; endWord.length == beginWord.length; 1 <= wordList.length <= 5000',
      testCases: [
        { input: 'beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]', expected: '5', description: 'word ladder length' }
      ]
    },
    {
      id: 'find-median-from-data-stream',
      difficulty: 'hard',
      problem: 'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values. Implement the MedianFinder class.',
      exampleInput: 'MedianFinder obj = new MedianFinder(); obj.addNum(1); obj.addNum(2); obj.findMedian(); obj.addNum(3); obj.findMedian();',
      expectedOutput: '1.5, 2.0',
      functionSignature: 'class MedianFinder { constructor() {}; addNum(num) {}; findMedian() {}; }',
      constraints: '-10^5 <= num <= 10^5; There will be at least one element in the data structure before calling findMedian',
      testCases: [
        { input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()', expected: '1.5, 2.0', description: 'median from data stream' }
      ]
    },
    {
      id: 'largest-rectangle-in-histogram',
      difficulty: 'hard',
      problem: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
      exampleInput: 'heights = [2,1,5,6,2,3]',
      expectedOutput: '10',
      functionSignature: 'function largestRectangleArea(heights) { }',
      constraints: '1 <= heights.length <= 10^5; 0 <= heights[i] <= 10^4',
      testCases: [
        { input: 'heights=[2,1,5,6,2,3]', expected: '10', description: 'largest rectangle area' }
      ]
    },
    {
      id: 'maximal-rectangle',
      difficulty: 'hard',
      problem: 'Given a rows x cols binary matrix filled with 0\'s and 1\'s, find the largest rectangle containing only 1\'s and return its area.',
      exampleInput: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',
      expectedOutput: '6',
      functionSignature: 'function maximalRectangle(matrix) { }',
      constraints: 'rows == matrix.length; cols == matrix[0].length; 1 <= row, cols <= 200',
      testCases: [
        { input: 'matrix=[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', expected: '6', description: 'maximal rectangle' }
      ]
    },
    {
      id: 'binary-tree-maximum-path-sum',
      difficulty: 'hard',
      problem: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. The path sum of the path is the sum of the node values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
      exampleInput: 'root = [1,2,3]',
      expectedOutput: '6',
      functionSignature: 'function maxPathSum(root) { }',
      constraints: 'The number of nodes in the tree is in the range [1, 3 * 10^4]; -1000 <= Node.val <= 1000',
      testCases: [
        { input: 'root=[1,2,3]', expected: '6', description: 'simple tree' },
        { input: 'root=[-10,9,20,null,null,15,7]', expected: '42', description: 'complex tree with negative values' }
      ]
    },
    {
      id: 'longest-consecutive-sequence',
      difficulty: 'hard',
      problem: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.',
      exampleInput: 'nums = [100,4,200,1,3,2]',
      expectedOutput: '4',
      functionSignature: 'function longestConsecutive(nums) { }',
      constraints: '0 <= nums.length <= 10^5; -10^9 <= nums[i] <= 10^9',
      testCases: [
        { input: 'nums=[100,4,200,1,3,2]', expected: '4', description: 'sequence 1,2,3,4' },
        { input: 'nums=[0,3,7,2,5,8,4,6,0,1]', expected: '9', description: 'long sequence' }
      ]
    },
    {
      id: 'word-break-ii',
      difficulty: 'hard',
      problem: 'Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.',
      exampleInput: 's = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]',
      expectedOutput: '["cats and dog","cat sand dog"]',
      functionSignature: 'function wordBreak(s, wordDict) { }',
      constraints: '1 <= s.length <= 20; 1 <= wordDict.length <= 1000; 1 <= wordDict[i].length <= 10',
      testCases: [
        { input: 's="catsanddog", wordDict=["cat","cats","and","sand","dog"]', expected: '["cats and dog","cat sand dog"]', description: 'multiple valid breaks' }
      ]
    },
    {
      id: 'burst-balloons',
      difficulty: 'hard',
      problem: 'You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it represented by an array nums. You are asked to burst all the balloons. If you burst the ith balloon, you will get nums[i - 1] * nums[i] * nums[i + 1] coins. Return the maximum coins you can collect by bursting the balloons wisely.',
      exampleInput: 'nums = [3,1,5,8]',
      expectedOutput: '167',
      functionSignature: 'function maxCoins(nums) { }',
      constraints: 'n == nums.length; 1 <= n <= 300; 0 <= nums[i] <= 100',
      testCases: [
        { input: 'nums=[3,1,5,8]', expected: '167', description: 'maximum coins strategy' }
      ]
    },
    {
      id: 'count-of-smaller-numbers-after-self',
      difficulty: 'hard',
      problem: 'You are given an integer array nums and you have to return a new counts array. The counts array has the property where counts[i] is the number of smaller elements to the right of nums[i].',
      exampleInput: 'nums = [5,2,6,1]',
      expectedOutput: '[2,1,1,0]',
      functionSignature: 'function countSmaller(nums) { }',
      constraints: '1 <= nums.length <= 10^5; -10^4 <= nums[i] <= 10^4',
      testCases: [
        { input: 'nums=[5,2,6,1]', expected: '[2,1,1,0]', description: 'count smaller numbers to the right' }
      ]
    },
    {
      id: 'reverse-nodes-in-k-group',
      difficulty: 'hard',
      problem: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.',
      exampleInput: 'head = [1,2,3,4,5], k = 2',
      expectedOutput: '[2,1,4,3,5]',
      functionSignature: 'function reverseKGroup(head, k) { }',
      constraints: 'The number of nodes in the list is n; 1 <= k <= n <= 5000',
      testCases: [
        { input: 'head=[1,2,3,4,5], k=2', expected: '[2,1,4,3,5]', description: 'reverse in k groups' }
      ]
    },
    {
      id: 'sudoku-solver',
      difficulty: 'hard',
      problem: 'Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: Each of the digits 1-9 must occur exactly once in each row, each column, and each of the 9 3x3 sub-boxes of the grid.',
      exampleInput: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
      expectedOutput: 'solved sudoku board',
      functionSignature: 'function solveSudoku(board) { }',
      constraints: 'board.length == 9; board[i].length == 9',
      testCases: [
        { input: 'standard sudoku board', expected: 'solved board', description: 'solve sudoku' }
      ]
    },
    {
      id: 'first-missing-positive',
      difficulty: 'hard',
      problem: 'Given an unsorted integer array nums, return the smallest missing positive integer.',
      exampleInput: 'nums = [1,2,0]',
      expectedOutput: '3',
      functionSignature: 'function firstMissingPositive(nums) { }',
      constraints: '1 <= nums.length <= 10^5; -2^31 <= nums[i] <= 2^31 - 1',
      testCases: [
        { input: 'nums=[1,2,0]', expected: '3', description: 'first missing positive' },
        { input: 'nums=[3,4,-1,1]', expected: '2', description: 'missing positive in middle' }
      ]
    },
    {
      id: 'n-queens-ii',
      difficulty: 'hard',
      problem: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return the number of distinct solutions to the n-queens puzzle.',
      exampleInput: 'n = 4',
      expectedOutput: '2',
      functionSignature: 'function totalNQueens(n) { }',
      constraints: '1 <= n <= 9',
      testCases: [
        { input: 'n=4', expected: '2', description: 'count n-queens solutions' }
      ]
    },
    {
      id: 'wildcard-matching',
      difficulty: 'hard',
      problem: 'Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for "?" and "*" where: "?" matches any single character, "*" matches any sequence of characters (including the empty sequence).',
      exampleInput: 's = "aa", p = "*"',
      expectedOutput: 'true',
      functionSignature: 'function isMatch(s, p) { }',
      constraints: '0 <= s.length, p.length <= 2000; s contains only lowercase English letters',
      testCases: [
        { input: 's="aa", p="*"', expected: 'true', description: 'wildcard matching with star' }
      ]
    },
    {
      id: 'jump-game-ii',
      difficulty: 'hard',
      problem: 'Given an array of non-negative integers nums, you are initially positioned at the first index of the array. Each element in the array represents your maximum jump length at that position. Your goal is to reach the last index in the minimum number of jumps.',
      exampleInput: 'nums = [2,3,1,1,4]',
      expectedOutput: '2',
      functionSignature: 'function jump(nums) { }',
      constraints: '1 <= nums.length <= 10^4; 0 <= nums[i] <= 1000',
      testCases: [
        { input: 'nums=[2,3,1,1,4]', expected: '2', description: 'minimum jumps to end' }
      ]
    },
    {
      id: 'permutation-sequence',
      difficulty: 'hard',
      problem: 'The set [1, 2, 3, ..., n] contains a total of n! unique permutations. By listing and labeling all of the permutations in order, we get the following sequence for n = 3: "123", "132", "213", "231", "312", "321". Given n and k, return the kth permutation sequence.',
      exampleInput: 'n = 3, k = 3',
      expectedOutput: '"213"',
      functionSignature: 'function getPermutation(n, k) { }',
      constraints: '1 <= n <= 9; 1 <= k <= n!',
      testCases: [
        { input: 'n=3, k=3', expected: '"213"', description: 'kth permutation sequence' }
      ]
    },
    {
      id: 'valid-number',
      difficulty: 'hard',
      problem: 'Given a string s, return whether s is a valid number.',
      exampleInput: 's = "0"',
      expectedOutput: 'true',
      functionSignature: 'function isNumber(s) { }',
      constraints: '1 <= s.length <= 20; s consists of only English letters, digits, " ", "+", "-", and ".".',
      testCases: [
        { input: 's="0"', expected: 'true', description: 'valid number' },
        { input: 's="e"', expected: 'false', description: 'invalid number' }
      ]
    },
        {
      id: 'insert-interval',
      difficulty: 'medium',
      problem: 'Given an array of non-overlapping intervals where intervals[i] = [starti, endi], insert newInterval into intervals such that intervals is still non-overlapping and sorted in ascending order.',
      exampleInput: 'intervals = [[1,3],[6,9]], newInterval = [2,5]',
      expectedOutput: '[[1,5],[6,9]]',
      functionSignature: 'function insert(intervals, newInterval) { }',
      constraints: '0 <= intervals.length <= 10^4; intervals[i].length == 2',
      testCases: [
        { input: 'intervals=[[1,3],[6,9]], newInterval=[2,5]', expected: '[[1,5],[6,9]]', description: 'insert and merge interval' }
      ]
    },
    {
      id: 'minimum-path-sum',
      difficulty: 'medium',
      problem: 'Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.',
      exampleInput: 'grid = [[1,3,1],[1,5,1],[4,2,1]]',
      expectedOutput: '7',
      functionSignature: 'function minPathSum(grid) { }',
      constraints: 'm == grid.length; n == grid[i].length; 1 <= m, n <= 200',
      testCases: [
        { input: 'grid=[[1,3,1],[1,5,1],[4,2,1]]', expected: '7', description: 'minimum path sum' }
      ]
    },
    {
      id: 'decode-ways',
      difficulty: 'medium',
      problem: 'A message containing letters from A-Z can be encoded into numbers using A->1, B->2, ... Z->26. Given a string s containing only digits, return the number of ways to decode it.',
      exampleInput: 's = "12"',
      expectedOutput: '2',
      functionSignature: 'function numDecodings(s) { }',
      constraints: '1 <= s.length <= 100; s contains only digits and may contain leading zero(s).',
      testCases: [
        { input: 's="12"', expected: '2', description: 'can be "AB" (1 2) or "L" (12)' }
      ]
    },
    {
      id: 'validate-binary-search-tree',
      difficulty: 'medium',
      problem: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
      exampleInput: 'root = [2,1,3]',
      expectedOutput: 'true',
      functionSignature: 'function isValidBST(root) { }',
      constraints: 'The number of nodes in the tree is in the range [1, 10^4]',
      testCases: [
        { input: 'root=[2,1,3]', expected: 'true', description: 'valid BST' },
        { input: 'root=[5,1,4,null,null,3,6]', expected: 'false', description: 'invalid BST' }
      ]
    },
    {
      id: 'course-schedule',
      difficulty: 'medium',
      problem: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
      exampleInput: 'numCourses = 2, prerequisites = [[1,0]]',
      expectedOutput: 'true',
      functionSignature: 'function canFinish(numCourses, prerequisites) { }',
      constraints: '1 <= numCourses <= 10^5; 0 <= prerequisites.length <= 5000',
      testCases: [
        { input: 'numCourses=2, prerequisites=[[1,0]]', expected: 'true', description: 'can finish courses' }
      ]
    },
    {
      id: 'implement-trie-prefix-tree',
      difficulty: 'medium',
      problem: 'Implement a trie (prefix tree) with insert, search, and startsWith methods.',
      exampleInput: 'Trie trie = new Trie(); trie.insert("apple"); trie.search("apple"); trie.search("app"); trie.startsWith("app"); trie.insert("app"); trie.search("app");',
      expectedOutput: 'true, false, true, true',
      functionSignature: 'class Trie { constructor() {}; insert(word) {}; search(word) {}; startsWith(prefix) {}; }',
      constraints: '1 <= word.length, prefix.length <= 2000',
      testCases: [
        { input: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")', expected: 'true, false, true, true', description: 'trie operations' }
      ]
    },
    {
      id: 'coin-change',
      difficulty: 'medium',
      problem: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.',
      exampleInput: 'coins = [1,2,5], amount = 11',
      expectedOutput: '3',
      functionSignature: 'function coinChange(coins, amount) { }',
      constraints: '1 <= coins.length <= 12; 1 <= coins[i] <= 2^31 - 1; 0 <= amount <= 10^4',
      testCases: [
        { input: 'coins=[1,2,5], amount=11', expected: '3', description: 'minimum coins needed' }
      ]
    },
    {
      id: 'product-of-array-except-self',
      difficulty: 'medium',
      problem: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
      exampleInput: 'nums = [1,2,3,4]',
      expectedOutput: '[24,12,8,6]',
      functionSignature: 'function productExceptSelf(nums) { }',
      constraints: '2 <= nums.length <= 10^5; -30 <= nums[i] <= 30',
      testCases: [
        { input: 'nums=[1,2,3,4]', expected: '[24,12,8,6]', description: 'product except self' }
      ]
    },
    {
      id: 'search-a-2d-matrix-ii',
      difficulty: 'medium',
      problem: 'Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix. This matrix has the following properties: Integers in each row are sorted in ascending from left to right. Integers in each column are sorted in ascending from top to bottom.',
      exampleInput: 'matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5',
      expectedOutput: 'true',
      functionSignature: 'function searchMatrix(matrix, target) { }',
      constraints: 'm == matrix.length; n == matrix[i].length; 1 <= n, m <= 300',
      testCases: [
        { input: 'matrix=[[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target=5', expected: 'true', description: 'search in sorted 2D matrix' }
      ]
    },
    {
      id: 'meeting-rooms-ii',
      difficulty: 'medium',
      problem: 'Given an array of meeting time intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.',
      exampleInput: 'intervals = [[0,30],[5,10],[15,20]]',
      expectedOutput: '2',
      functionSignature: 'function minMeetingRooms(intervals) { }',
      constraints: '1 <= intervals.length <= 10^4; 0 <= starti < endi <= 10^6',
      testCases: [
        { input: 'intervals=[[0,30],[5,10],[15,20]]', expected: '2', description: 'minimum meeting rooms needed' }
      ]
    },
    {
      id: 'rotate-array',
      difficulty: 'medium',
      problem: 'Given an array, rotate the array to the right by k steps, where k is non-negative.',
      exampleInput: 'nums = [1,2,3,4,5,6,7], k = 3',
      expectedOutput: '[5,6,7,1,2,3,4]',
      functionSignature: 'function rotate(nums, k) { }',
      constraints: '1 <= nums.length <= 10^5; -2^31 <= nums[i] <= 2^31 - 1; 0 <= k <= 10^5',
      testCases: [
        { input: 'nums=[1,2,3,4,5,6,7], k=3', expected: '[5,6,7,1,2,3,4]', description: 'rotate array right by k' }
      ]
    },
    {
      id: 'find-the-duplicate-number',
      difficulty: 'medium',
      problem: 'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number.',
      exampleInput: 'nums = [1,3,4,2,2]',
      expectedOutput: '2',
      functionSignature: 'function findDuplicate(nums) { }',
      constraints: '1 <= n <= 10^5; nums.length == n + 1; 1 <= nums[i] <= n',
      testCases: [
        { input: 'nums=[1,3,4,2,2]', expected: '2', description: 'find duplicate number' }
      ]
    },
    {
      id: 'top-k-frequent-elements',
      difficulty: 'medium',
      problem: 'Given an integer array nums and an integer k, return the k most frequent elements.',
      exampleInput: 'nums = [1,1,1,2,2,3], k = 2',
      expectedOutput: '[1,2]',
      functionSignature: 'function topKFrequent(nums, k) { }',
      constraints: '1 <= nums.length <= 10^5; -10^4 <= nums[i] <= 10^4',
      testCases: [
        { input: 'nums=[1,1,1,2,2,3], k=2', expected: '[1,2]', description: 'top k frequent elements' }
      ]
    },
    {
      id: 'text-justification',
      difficulty: 'hard',
      problem: 'Given an array of words and a width maxWidth, format the text such that each line has exactly maxWidth characters and is fully (left and right) justified.',
      exampleInput: 'words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16',
      expectedOutput: '["This    is    an","example  of text","justification.  "]',
      functionSignature: 'function fullJustify(words, maxWidth) { }',
      constraints: '1 <= words.length <= 300; 1 <= words[i].length <= 20',
      testCases: [
        { input: 'words=["This", "is", "an", "example", "of", "text", "justification."], maxWidth=16', expected: '["This    is    an","example  of text","justification.  "]', description: 'text justification' }
      ]
    },
    {
      id: 'edit-distance',
      difficulty: 'hard',
      problem: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.',
      exampleInput: 'word1 = "horse", word2 = "ros"',
      expectedOutput: '3',
      functionSignature: 'function minDistance(word1, word2) { }',
      constraints: '0 <= word1.length, word2.length <= 500; word1 and word2 consist of lowercase English letters.',
      testCases: [
        { input: 'word1="horse", word2="ros"', expected: '3', description: 'edit distance' }
      ]
    }
  ]
};