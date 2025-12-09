// AssessmentData.js
import { detailedRoadmaps } from './RoadmapData';

// --- Extract all topics from the roadmap dynamically ---
function extractTopics(roadmapSection) {
  const topics = [];
  if (!roadmapSection?.phases) return topics;
  roadmapSection.phases.forEach((phase) => {
    phase.weeks.forEach((week) => {
      if (week.topics) topics.push(...week.topics);
    });
  });
  return topics;
}

// --- Generate relevant MCQs based on topics ---
function generateQuestionsFromTopics(topics) {
  const templates = {
    basics: (t) => ({
      question: `What is ${t}?`,
      options: [
        `A key concept in ${t}`,
        `A syntax feature of ${t}`,
        `A UI element in ${t}`,
        `A backend API concept`
      ],
      correct: 0,
      explanation: `${t} is one of the core topics you'll study early in the roadmap.`,
    }),
    concept: (t) => ({
      question: `Why is ${t} important in software development?`,
      options: [
        `It improves code structure and maintainability`,
        `It reduces build size`,
        `It makes UI colorful`,
        `It is not widely used`
      ],
      correct: 0,
      explanation: `${t} helps developers write cleaner, optimized, and more scalable code.`,
    }),
    advanced: (t) => ({
      question: `Which of the following best describes ${t}?`,
      options: [
        `An advanced feature or library used in modern frameworks`,
        `A deprecated syntax element`,
        `A markup tag used in HTML`,
        `A CSS layout rule`
      ],
      correct: 0,
      explanation: `${t} is an advanced-level topic from your roadmap.`,
    }),
  };

  // Limit and generate 10 dynamic questions
  return topics.slice(0, 10).map((topic, i) => {
    const template = i < 3 ? templates.basics : i < 6 ? templates.concept : templates.advanced;
    return template(topic);
  });
}

// --- Main exported function used by TechnicalAssessment ---
export function getQuestionsForAssessment(userSelections, limit = 10) {
  if (!userSelections) return [];

  const { field, role, language } = userSelections;

  // Try to find the roadmap section matching user's selection
  const roadmapSection =
    detailedRoadmaps?.[field]?.[role]?.[language] ||
    detailedRoadmaps?.[field]?.[role] ||
    null;

  if (!roadmapSection) return [];

  const topics = extractTopics(roadmapSection);
  const allQuestions = generateQuestionsFromTopics(topics);

  // Shuffle and limit questions
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, limit);
}
