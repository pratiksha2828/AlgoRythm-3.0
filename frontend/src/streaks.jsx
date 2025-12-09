import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Tooltip,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  School as LearningIcon,
  Timeline as TracingIcon,
  Quiz as TestIcon,
  Folder as ProjectsIcon,
  AutoAwesome as SparkleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { detailedRoadmaps } from './RoadmapData';
import { milestoneDefs } from './data/milestones';

const Streaks = () => {
  const API_BASE =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE) ||
    'http://localhost:5000';

  const [streaks, setStreaks] = useState({
    learningStreak: 0,
    tracingStreak: 0,
    testStreak: 0,
    projectsStreak: 0,
    dailyChallengeStreak: 0
  });
  const [streakUserId, setStreakUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [highestStreaks, setHighestStreaks] = useState({
    learningStreak: 0,
    tracingStreak: 0,
    testStreak: 0,
    projectsStreak: 0,
    dailyChallengeStreak: 0
  });
  const [_totalClaims, setTotalClaims] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const streakCards = [
    {
      type: 'learningStreak',
      title: 'Learning Streak',
      description: 'Complete daily learning challenges',
      icon: <LearningIcon sx={{ fontSize: 32 }} />
    },
    {
      type: 'tracingStreak',
      title: 'Code Tracing',
      description: 'Trace and understand code daily',
      icon: <TracingIcon sx={{ fontSize: 32 }} />
    },
    {
      type: 'testStreak',
      title: 'Test Cases',
      description: 'Write and run test cases',
      icon: <TestIcon sx={{ fontSize: 32 }} />
    },
    {
      type: 'projectsStreak',
      title: 'Projects',
      description: 'Work on coding projects',
      icon: <ProjectsIcon sx={{ fontSize: 32 }} />
    },
    {
      type: 'dailyChallengeStreak',
      title: 'Daily Challenge Streaks',
      description:
        'Short 3-question challenge — pass all to update streak',
      icon: <SparkleIcon sx={{ fontSize: 32 }} />
    }
  ];

  /** ====================== FETCH STREAKS ======================= */
  const fetchStreaks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/streaks/me`, {
        credentials: 'include'
      });

      const ct = response.headers.get('content-type') || '';
      if (ct.includes('text/html')) throw new Error('Not authenticated.');

      if (!response.ok) throw new Error('Failed to fetch streaks');
      const data = await response.json();

      setStreakUserId(data.streakUserId || null);
      setUsername(data.username || null);
      setStreaks(data.streaks || streaks);
      setHighestStreaks(data.highestStreaks || data.streaks || streaks);
      setTotalClaims(data.totalClaims || 0);
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchStreaks();
  }, [fetchStreaks]);

  // persist highest streaks to sessionStorage so other pages (Profile) can read them
  useEffect(() => {
    try {
      sessionStorage.setItem('highestStreaks', JSON.stringify(highestStreaks || {}));
    } catch {
      // ignore
    }
  }, [highestStreaks]);

  /** ====================== HELPERS ======================= */
  const getStreakDisplayName = (streakType) => {
    const names = {
      learningStreak: 'Learning',
      tracingStreak: 'Tracing',
      testStreak: 'Test',
      projectsStreak: 'Projects',
      dailyChallengeStreak: 'Daily Challenge'
    };
    return names[streakType] || streakType;
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  /** ====================== CLAIM STREAK ======================= */
  const claimStreak = async (streakType) => {
    try {
      setUpdating(true);
      if (!streakUserId)
        throw new Error('User ID unknown. Please login again.');

      const response = await fetch(
        `${API_BASE}/api/streaks/${encodeURIComponent(streakUserId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ streakType })
        }
      );

      if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update streak:', response.status, errorText);
      throw new Error(`Failed to update streak (${response.status})`);
    }
      const data = await response.json();

      if (data.success) {
        const user = data.user || {};
        setStreaks(user);
        setHighestStreaks((prev) => ({
          learningStreak: Math.max(
            prev.learningStreak,
            user.learningStreak || 0
          ),
          tracingStreak: Math.max(
            prev.tracingStreak,
            user.tracingStreak || 0
          ),
          testStreak: Math.max(prev.testStreak, user.testStreak || 0),
          projectsStreak: Math.max(
            prev.projectsStreak,
            user.projectsStreak || 0
          ),
          dailyChallengeStreak: Math.max(
            prev.dailyChallengeStreak,
            user.dailyChallengeStreak || 0
          )
        }));
        showSnackbar(
          `🚀 ${getStreakDisplayName(
            streakType
          )} streak updated successfully!`
        );
      }
    } catch (error) {
      console.error('Failed to update streak:', error);
      showSnackbar(error.message || 'Failed to update streak', 'error');
    } finally {
      setUpdating(false);
    }
  };

  /** ====================== QUIZ LOGIC ======================= */
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedSubpath, setSelectedSubpath] = useState('');
  const [selectedSpecific, setSelectedSpecific] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState(0);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const maxTries = 5;

  const roadmapTopKeys = Object.keys(detailedRoadmaps || {});
  const getSubOptions = (top) =>
    Object.keys(detailedRoadmaps?.[top] || {});
  const getSpecificOptions = (top, sub) =>
    Object.keys(detailedRoadmaps?.[top]?.[sub] || {});

  /** Extract topics from roadmap */
  const extractTopics = (roadmapSection) => {
    const topics = [];
    if (!roadmapSection?.phases) return topics;
    roadmapSection.phases.forEach((phase) => {
      (phase.weeks || []).forEach((week) => {
        if (week.topics) topics.push(...week.topics);
        if (week.projects) topics.push(...week.projects);
      });
    });
    return Array.from(new Set(topics)).filter(Boolean);
  };

  /** Generate real questions from topics */
  const generateQuestionsFromTopics = useCallback(
  (topics) => {
    // Better random
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const streak = streaks.dailyChallengeStreak || 0;

    // Difficulty Levels:
    // 1 = Easy, 2 = Medium, 3 = Hard
    const difficulty = Math.min(Math.floor(streak / 7) + 1, 3);

    /** ---------------------------------------------
     * MULTIPLE QUESTION VARIATIONS PER DIFFICULTY
     * 6 variations each → 18 total variations/topic
     * ---------------------------------------------
     */

    const templates = {
      basics: (t) => {
        const variations = [
          {
            question: `What is ${t}?`,
            correct: `${t} is a fundamental concept in software development.`,
            wrong: [
              `${t} is used only for UI design.`,
              `${t} is a deprecated concept.`,
              `${t} is unrelated to programming.`,
            ]
          },
          {
            question: `Which best describes ${t}?`,
            correct: `${t} is an essential part of learning this domain.`,
            wrong: [
              `${t} is only used in outdated systems.`,
              `${t} exists only in mobile apps.`,
              `${t} has no relevance today.`,
            ]
          },
          {
            question: `Why do beginners learn ${t}?`,
            correct: `Because ${t} forms the base of all higher-level concepts.`,
            wrong: [
              `Because ${t} is optional.`,
              `Because ${t} is unrelated to coding.`,
              `Because ${t} is used only in hardware.`,
            ]
          },
          {
            question: `Select the correct statement about ${t}.`,
            correct: `${t} helps in understanding core programming flow.`,
            wrong: [
              `${t} slows down program execution.`,
              `${t} is used only by AI systems.`,
              `${t} replaces all other concepts.`,
            ]
          },
          {
            question: `${t} is mainly associated with:`,
            correct: `Basic understanding of how systems work.`,
            wrong: [
              `Rendering 3D graphics.`,
              `Managing cloud servers.`,
              `Only writing tests.`,
            ]
          },
          {
            question: `Which of the following is true about ${t}?`,
            correct: `${t} is widely used across multiple topics.`,
            wrong: [
              `${t} cannot be learned by beginners.`,
              `${t} is not used in real-world applications.`,
              `${t} is unrelated to the selected path.`,
            ]
          }
        ];

        const choice = random(variations);
        const options = [...choice.wrong, choice.correct].sort(() => Math.random() - 0.5);

        return {
          question: choice.question,
          options,
          correct: options.indexOf(choice.correct),
          explanation: `${t} is an important beginner-level concept.`
        };
      },

      concept: (t) => {
        const variations = [
          {
            question: `Why is ${t} important?`,
            correct: `${t} improves structure and maintainability.`,
            wrong: [
              `${t} decreases readability.`,
              `${t} is not used often.`,
              `${t} causes unnecessary complexity.`,
            ]
          },
          {
            question: `What is the main use of ${t}?`,
            correct: `${t} helps build scalable and efficient systems.`,
            wrong: [
              `${t} is only used for decoration.`,
              `${t} slows down execution.`,
              `${t} breaks application flow.`,
            ]
          },
          {
            question: `Which benefit does ${t} offer?`,
            correct: `${t} enhances clarity and understanding.`,
            wrong: [
              `${t} reduces performance.`,
              `${t} is only for testing.`,
              `${t} is not relevant in modern apps.`,
            ]
          },
          {
            question: `Choose the correct statement about ${t}.`,
            correct: `${t} supports better coding practices.`,
            wrong: [
              `${t} is used only in old systems.`,
              `${t} has very limited applications.`,
              `${t} replaces core programming.`,
            ]
          },
          {
            question: `When should ${t} be used?`,
            correct: `${t} is used when organizing application logic.`,
            wrong: [
              `${t} is used only for animations.`,
              `${t} is required only for UI design.`,
              `${t} is never used in backend.`,
            ]
          },
          {
            question: `How does ${t} help developers?`,
            correct: `${t} reduces complexity and improves modularity.`,
            wrong: [
              `${t} increases unnecessary files.`,
              `${t} has no impact on workflow.`,
              `${t} is not preferred in industry.`,
            ]
          }
        ];

        const choice = random(variations);
        const options = [...choice.wrong, choice.correct].sort(() => Math.random() - 0.5);

        return {
          question: choice.question,
          options,
          correct: options.indexOf(choice.correct),
          explanation: `${t} is a medium-level conceptual topic.`
        };
      },

      advanced: (t) => {
        const variations = [
          {
            question: `Which best describes modern use of ${t}?`,
            correct: `${t} is widely used in advanced industry practices.`,
            wrong: [
              `${t} is considered obsolete.`,
              `${t} is only used by beginners.`,
              `${t} applies only to legacy apps.`,
            ]
          },
          {
            question: `How does ${t} apply in advanced systems?`,
            correct: `${t} ensures reliability in large-scale applications.`,
            wrong: [
              `${t} only works on small scripts.`,
              `${t} is never used in frameworks.`,
              `${t} is outdated in modern architecture.`,
            ]
          },
          {
            question: `What role does ${t} play in modern development?`,
            correct: `${t} enables optimized and scalable workflow.`,
            wrong: [
              `${t} has zero impact today.`,
              `${t} is used only for testing.`,
              `${t} provides no real benefits.`,
            ]
          },
          {
            question: `Select the accurate statement about ${t}.`,
            correct: `${t} is critical for advanced technical design.`,
            wrong: [
              `${t} is optional and rarely used.`,
              `${t} is discouraged in production.`,
              `${t} has no benefit in architecture.`,
            ]
          },
          {
            question: `Where is ${t} most commonly used today?`,
            correct: `${t} is essential in modern frameworks and systems.`,
            wrong: [
              `${t} is exclusive to old compilers.`,
              `${t} is only used in game engines.`,
              `${t} has been replaced fully.`,
            ]
          },
          {
            question: `Which scenario demonstrates ${t}?`,
            correct: `${t} applied to optimize complex workflows.`,
            wrong: [
              `${t} used to remove key features.`,
              `${t} used only to decorate UI.`,
              `${t} used to slow down processing.`,
            ]
          }
        ];

        const choice = random(variations);
        const options = [...choice.wrong, choice.correct].sort(() => Math.random() - 0.5);

        return {
          question: choice.question,
          options,
          correct: options.indexOf(choice.correct),
          explanation: `${t} is an advanced-level applied concept.`
        };
      }
    };

    /** -------------------
     * FINAL QUESTION PICK
     * -------------------
     */

    const picks = [...topics].sort(() => Math.random() - 0.5).slice(0, 3);

    const questions = picks.map((topic, idx) => {
      const fn =
        difficulty === 1
          ? templates.basics
          : difficulty === 2
          ? templates.concept
          : templates.advanced;

      return { id: idx + 1, ...fn(topic) };
    });

    return questions;
  },
  [streaks]
);


  useEffect(() => {
    if (selectedPath && selectedSubpath && selectedSpecific) {
      setQuizLoading(true);
      try {
        const roadmapSection = detailedRoadmaps?.[selectedPath]?.[selectedSubpath]?.[selectedSpecific];
        const topics = extractTopics(roadmapSection);
        const questions = generateQuestionsFromTopics(topics);
        setQuizQuestions(questions);
        setUserAnswers({});
      } catch (err) {
        console.error('Failed to generate questions:', err);
        setQuizQuestions([]);
      } finally {
        setQuizLoading(false);
      }
    }
  }, [selectedPath, selectedSubpath, selectedSpecific, generateQuestionsFromTopics]);

  const handleAnswer = (qid, idx) =>
    setUserAnswers((prev) => ({ ...prev, [qid]: idx }));

  const submitQuiz = async () => {
    const allCorrect = quizQuestions.every(
      (q) => userAnswers[q.id] === q.correct
    );

    if (!allCorrect) {
      if (quizAttempt + 1 < maxTries) {
        setQuizAttempt((prev) => prev + 1);
        setUserAnswers({});
        showSnackbar(`❌ Incorrect. You have ${maxTries - 1 - quizAttempt} tries left!`, 'error');
        return;
      } else {
        setShowCorrectAnswers(true);
        showSnackbar('❌ No tries left. Here are the correct answers!', 'error');
        // Mark challenge as exhausted for today
        const today = new Date().toDateString();
        sessionStorage.setItem('lastChallengeDate', today);
        sessionStorage.setItem('dailyChallengeStatus', `${today}:exhausted`);
        return;
      }
    }

    // All correct - claim streak and mark as completed
    setShowQuizModal(false);
    showSnackbar('🎉 All correct! Daily Challenge streak increased!');
    const today = new Date().toDateString();
    sessionStorage.setItem('lastChallengeDate', today);
    sessionStorage.setItem('dailyChallengeStatus', `${today}:completed`);
    await claimStreak('dailyChallengeStreak');
  };

  const handleCardAction = (type) => {
    if (type === 'dailyChallengeStreak') {
      setSelectedPath('');
      setSelectedSubpath('');
      setSelectedSpecific('');
      setQuizAttempt(0);
      setShowCorrectAnswers(false);
      setShowQuizModal(true);
    } else {
      claimStreak(type);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress sx={{ color: '#06b6d4' }} />
      </Box>
    );

  /** ====================== MILESTONES ======================= */
  // milestoneDefs is defined at module top-level and exported for reuse

  const earnedByMilestone = milestoneDefs.map((m) => {
    const categories = Object.keys(highestStreaks)
      .filter((k) => (highestStreaks[k] || 0) >= m.days)
      .map((k) => getStreakDisplayName(k));
    return { ...m, categories };
  });

  /** ====================== RENDER ======================= */
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/images/Generate a cosmic sp.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: '#bfe6ff',
            fontWeight: 700,
            mb: 0.5,
            textShadow: '0 6px 28px rgba(99,102,241,0.18)',
            fontSize: '2rem'
          }}
        >
          Cosmic Streaks
        </Typography>

        <Typography sx={{ color: '#9ad7ff', mb: 0.5, fontSize: '0.9rem' }}>
          {username ? `Welcome, ${username}` : ''}
        </Typography>

        {username && (
          <Typography sx={{ color: '#7fb0c7', fontSize: '0.7rem', mb: 1 }}>
            ID: {String(streakUserId || '').toUpperCase().slice(0, 6)}
          </Typography>
        )}

        {/* Max Streaks and Badges Pill */}
        <Box
          sx={{
            display: 'inline-block',
            mb: 1,
            p: '8px 16px',
            borderRadius: 999,
            border: '1px solid rgba(96,165,250,0.24)',
            background: 'linear-gradient(90deg, rgba(3,10,30,0.6), rgba(6,24,40,0.48))',
            boxShadow:
              '0 14px 50px rgba(96,165,250,0.12), 0 0 32px rgba(96,165,250,0.08)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: '#cceeff', fontWeight: 700, fontSize: '0.8rem' }}>
              Max Streaks: {Math.max(...Object.values(highestStreaks))} days
            </Typography>
            <Typography sx={{ color: '#9fb6c9', fontSize: '0.8rem' }}>•</Typography>
            <Typography sx={{ color: '#cceeff', fontWeight: 700, fontSize: '0.8rem' }}>
              Badges Earned:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {earnedByMilestone
                .filter((m) => m.categories && m.categories.length > 0)
                .map((m) => {
                  const countLabel =
                    m.categories.length > 1 ? `${m.label}(${m.categories.length})` : m.label;
                  return (
                    <Tooltip
                      key={m.label}
                      title={`${m.days} days — ${m.categories.join(', ')}`}
                      arrow
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: m.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.55rem',
                          fontWeight: 900,
                          color: '#001',
                          cursor: 'pointer'
                        }}
                      >
                        {countLabel}
                      </Box>
                    </Tooltip>
                  );
                })}
            </Box>
          </Box>
        </Box>

        {/* Inspirational Quote */}
        <Box
          sx={{
            mb: 1.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            background: 'linear-gradient(90deg, rgba(6,10,28,0.42), rgba(3,6,18,0.32))',
            border: '1px solid rgba(255,255,255,0.03)',
            maxWidth: '900px'
          }}
        >
          <Typography
            sx={{
              color: '#cfeefe',
              fontSize: '0.75rem',
              fontStyle: 'italic',
              textAlign: 'center'
            }}
          >
            "Small consistent steps lead to extraordinary journeys — one claim a day is progress."
          </Typography>
        </Box>

        {/* Streak Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1.5,
            width: '100%',
            maxWidth: '1600px',
            mb: 1.5,
            '@keyframes fireFlicker': {
              '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
              '25%': { transform: 'scale(1.05) rotate(1deg)', opacity: 0.9 },
              '50%': { transform: 'scale(0.98) rotate(-1deg)', opacity: 1 },
              '75%': { transform: 'scale(1.02) rotate(0.5deg)', opacity: 0.95 }
            },
            '@keyframes flamePulse': {
              '0%, 100%': { 
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(220, 220, 220, 0.4), 0 0 60px rgba(192, 192, 192, 0.2)' 
              },
              '50%': { 
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(240, 240, 240, 0.6), 0 0 90px rgba(211, 211, 211, 0.4)' 
              }
            },
            '@keyframes emberFloat': {
              '0%': { transform: 'translateY(0px) translateX(0px)', opacity: 0 },
              '10%': { opacity: 1 },
              '90%': { opacity: 1 },
              '100%': { transform: 'translateY(-20px) translateX(10px)', opacity: 0 }
            },
            '@keyframes fireGlow': {
              '0%, 100%': { filter: 'brightness(1) contrast(1)' },
              '50%': { filter: 'brightness(1.2) contrast(1.1)' }
            }
          }}
        >
          {streakCards.map((card) => (
            <Box
              key={card.type}
              sx={{
                p: 1.5,
                borderRadius: 3,
                textAlign: 'center',
                border: card.type === 'dailyChallengeStreak'
                ? '2px solid rgba(120, 200, 255, 0.8)'
                : '2px solid rgba(100,210,255,0.36)',

              background: card.type === 'dailyChallengeStreak'
                ? 'linear-gradient(180deg, rgba(10,20,40,0.95), rgba(5,10,25,0.85))'
                : 'linear-gradient(180deg, rgba(6,12,30,0.86), rgba(3,8,24,0.62))',

              boxShadow: card.type === 'dailyChallengeStreak'
                ? '0 0 18px rgba(120,160,255,0.22), 0 0 40px rgba(100,140,255,0.15)'
                : '0 20px 72px rgba(6,16,50,0.68), 0 0 48px rgba(72,200,255,0.18)',

                color: '#fff',
                position: 'relative',
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                animation: card.type === 'dailyChallengeStreak' 
                  ? 'fireFlicker 3s ease-in-out infinite, flamePulse 2s ease-in-out infinite' 
                  : 'none',
                '&::before': card.type === 'dailyChallengeStreak' ? {
                  content: '""',
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '30px',
                  background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.8) 0%, rgba(220, 220, 220, 0.6) 50%, transparent 100%)',
                  borderRadius: '50%',
                  animation: 'emberFloat 4s ease-in-out infinite',
                  pointerEvents: 'none'
                } : {},
                '&::after': card.type === 'dailyChallengeStreak' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '-5px',
                  left: '20%',
                  width: '8px',
                  height: '8px',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(240, 240, 240, 0.7) 100%)',
                  borderRadius: '50%',
                  animation: 'emberFloat 3s ease-in-out infinite 1s',
                  pointerEvents: 'none'
                } : {},
                overflow: 'hidden'
              }}
            >
              {/* Card Image */}
              <Box
                sx={{
                  width: '100%',
                  height: 150,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  mb: 0.5,
                  background: card.type === 'dailyChallengeStreak'
                    ? 'linear-gradient(180deg, rgba(245, 245, 245, 0.95), rgba(220, 220, 220, 0.8))'
                    : 'linear-gradient(180deg, rgba(8,16,36,0.92), rgba(4,10,26,0.64))',
                  border: card.type === 'dailyChallengeStreak'
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(120,170,255,0.2)',
                  boxShadow: card.type === 'dailyChallengeStreak'
                    ? '0 0 22px rgba(150,180,255,0.18), inset 0 0 10px rgba(180,200,255,0.10)'
                    : '0 28px 88px rgba(6,18,50,0.6), 0 0 72px rgba(98,120,255,0.18)',
                  position: 'relative',
                  animation: card.type === 'dailyChallengeStreak' ? 'fireGlow 1.5s ease-in-out infinite' : 'none',
                  '&::before': card.type === 'dailyChallengeStreak' ? {
                    content: '""',
                    position: 'absolute',
                    top: '10%',
                    left: '20%',
                    width: '15px',
                    height: '25px',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 240, 240, 0.7) 50%, rgba(220, 220, 220, 0.5) 100%)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    animation: 'fireFlicker 2s ease-in-out infinite',
                    opacity: 0.8
                  } : {},
                  '&::after': card.type === 'dailyChallengeStreak' ? {
                    content: '""',
                    position: 'absolute',
                    top: '15%',
                    right: '25%',
                    width: '12px',
                    height: '20px',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(230, 230, 230, 0.6) 100%)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    animation: 'fireFlicker 2.5s ease-in-out infinite 0.5s',
                    opacity: 0.7
                  } : {}
                }}
              >
                <img
                  src={
                    card.type === "dailyChallengeStreak"
                      ? "/images/dailyChallengeStreak.png"
                      : `/images/${card.type}.png`
                  }
                  alt={card.title}
                  onError={(e) => {
                    e.currentTarget.src = "/images/fallback.png";
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 10,
                    display: "block",
                    // eslint-disable-next-line no-dupe-keys
                    objectFit: "cover",
                    // eslint-disable-next-line no-dupe-keys
                    display: "block",
                    filter:
                    card.type === "dailyChallengeStreak"
                      ? "drop-shadow(0 0 1.5px rgba(100,180,255,0.25))"
                      : "none"
                  }}
                />
              </Box>

              {/* Card Content */}
              <Typography
                sx={{
                  color: '#d8faff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  mb: 0.25,
                  textShadow: '0 8px 28px rgba(96,220,255,0.22)'
                }}
              >
                {card.title}
              </Typography>
              <Typography
                sx={{
                  color: '#bff5ff',
                  fontSize: '0.6rem',
                  mb: 0.5,
                  textShadow: '0 4px 12px rgba(96,220,255,0.08)'
                }}
              >
                {card.description}
              </Typography>

              <Typography
                sx={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: card.type === 'dailyChallengeStreak' ? '#ffffff' : '#f5ffff',
                  textShadow: card.type === 'dailyChallengeStreak'
                    ? '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(220, 220, 220, 0.6), 0 0 30px rgba(192, 192, 192, 0.4)'
                    : '0 10px 32px rgba(100,220,255,0.38)',
                  mb: 0.25,
                  animation: card.type === 'dailyChallengeStreak'
                  ? 'fireFlicker 3s ease-in-out infinite, flamePulse 2s ease-in-out infinite, pulseGlow 3s ease-in-out infinite'
                  : 'none',
                  position: 'relative',
                  '&::before': card.type === 'dailyChallengeStreak' ? {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(240, 240, 240, 0.2), rgba(220, 220, 220, 0.1))',
                    borderRadius: '4px',
                    zIndex: -1,
                    animation: 'flamePulse 1.5s ease-in-out infinite'
                  } : {}
                }}
              >
                {streaks[card.type]}
              </Typography>
              <Typography
                sx={{
                  color: '#c6f5ff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  mb: 0.5,
                  textShadow: '0 4px 10px rgba(96,220,255,0.12)'
                }}
              >
                {streaks[card.type] === 1 ? 'day' : 'days'}
              </Typography>
              <Typography
                sx={{
                  color: '#c6f5ff',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  mb: 1,
                  textShadow: '0 6px 14px rgba(96,220,255,0.10)'
                }}
              >
                Best: {highestStreaks[card.type] || 0}d
              </Typography>

              {/* Button */}
              <Button
                variant="contained"
                onClick={() => handleCardAction(card.type)}
                disabled={updating}
                sx={{
                  mt: 'auto',
                  background: card.type === 'dailyChallengeStreak'
                    ? 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)'
                    : 'linear-gradient(180deg, #c8c0ff 0%, #9085f8 40%, #5a48e6 100%)',
                  color: card.type === 'dailyChallengeStreak' ? '#333333' : '#f0f8ff',
                  border: card.type === 'dailyChallengeStreak'
                    ? '1px solid rgba(255, 255, 255, 0.5)'
                    : '1px solid rgba(100,150,255,0.30)',
                  boxShadow: card.type === 'dailyChallengeStreak'
                    ? '0 18px 52px rgba(255, 255, 255, 0.6), 0 0 100px rgba(220, 220, 220, 0.4), inset 0 0 10px rgba(192, 192, 192, 0.3)'
                    : '0 18px 52px rgba(56,48,150,0.44), 0 0 100px rgba(100,120,255,0.30)',
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  textTransform: 'none',
                  borderRadius: 20,
                  py: 0.8,
                  px: 1.5,
                  width: '70%',
                  mx: 'auto',
                  fontSize: '0.75rem',
                  animation: card.type === 'dailyChallengeStreak' ? 'fireGlow 2s ease-in-out infinite' : 'none',
                  position: 'relative',
                  '&::before': card.type === 'dailyChallengeStreak' ? {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.4), rgba(240, 240, 240, 0.3), rgba(220, 220, 220, 0.2))',
                    borderRadius: '22px',
                    zIndex: -1,
                    animation: 'flamePulse 1.8s ease-in-out infinite'
                  } : {},
                  '&:hover': {
                    background: card.type === 'dailyChallengeStreak'
                      ? 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 50%, #d8d8d8 100%)'
                      : 'linear-gradient(180deg, #a890ff 0%, #a085f8 40%, #7a58e6 100%)',
                    boxShadow: card.type === 'dailyChallengeStreak'
                      ? '0 20px 60px rgba(255, 255, 255, 0.8), 0 0 120px rgba(220, 220, 220, 0.6)'
                      : '0 20px 60px rgba(56,48,150,0.6), 0 0 120px rgba(100,120,255,0.4)'
                  }
                }}
              >
                {updating
                  ? 'Updating...'
                  : card.type === 'dailyChallengeStreak'
                  ? 'Take Daily Challenge'
                  : 'Claim'}
              </Button>
            </Box>
          ))}
        </Box>

        {/* Milestones Section */}
        <Box sx={{ mt: 1, width: '100%', maxWidth: '1600px' }}>
          <Typography
            sx={{
              color: '#cfeefe',
              fontWeight: 700,
              mb: 1,
              fontSize: '0.95rem',
              textAlign: 'center'
            }}
          >
            Milestones
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              border: '1px solid rgba(96,165,250,0.2)',
              background: 'linear-gradient(90deg, rgba(3,10,30,0.72), rgba(6,24,40,0.48))',
              boxShadow: '0 16px 52px rgba(96,165,250,0.12), 0 0 36px rgba(96,165,250,0.08)'
            }}
          >
            {earnedByMilestone.map((m) => (
              <Box
                key={m.label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: m.gradient,
                    boxShadow: `0 0 30px ${m.glow}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    color: '#001'
                  }}
                >
                  {m.label}
                </Box>
                <Typography
                  sx={{
                    color: m.glow.replace('0.75)', '1)'),
                    fontWeight: 800,
                    fontSize: '0.65rem',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  {m.name}
                </Typography>
                <Typography sx={{ color: '#fff0f7', fontWeight: 700, fontSize: '0.6rem' }}>
                  {m.days} days
                </Typography>
                {m.categories.length > 0 && (
                  <Typography sx={{ color: '#cfeefe', fontSize: '0.55rem', textAlign: 'center', lineHeight: 1.1 }}>
                    {/* categories hidden */}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 0.5, textAlign: 'center' }}>
          <Typography sx={{ color: '#9fb6c9', fontSize: '0.75rem' }}>
            Earn each badge when your maximum continuous streak for any category reaches the number above.
          </Typography>
        </Box>
        <Modal open={showQuizModal} onClose={() => setShowQuizModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              bgcolor: 'rgba(6,10,30,0.95)',
              borderRadius: 2,
              p: 3,
              boxShadow: 24
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2
              }}
            >
              <Typography sx={{ color: '#cfeefe', fontWeight: 700 }}>
                Daily Challenge Quiz
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography sx={{ color: '#cfeefe', fontSize: '0.85rem' }}>
                  Tries: {maxTries - quizAttempt}/{maxTries}
                </Typography>
                <IconButton
                  onClick={() => setShowQuizModal(false)}
                  sx={{ color: '#cfeefe' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Domain Selection */}
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#cfeefe' }}>Path</InputLabel>
                <Select
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  sx={{
                    color: '#cfeefe',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(100,210,255,0.36)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(100,210,255,0.6)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00d1b2'
                    }
                  }}
                >
                  {roadmapTopKeys.map((path) => (
                    <MenuItem key={path} value={path}>
                      {path}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#cfeefe' }}>Subpath</InputLabel>
                <Select
                  value={selectedSubpath}
                  onChange={(e) => setSelectedSubpath(e.target.value)}
                  disabled={!selectedPath}
                  sx={{
                    color: '#cfeefe',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(100,210,255,0.36)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(100,210,255,0.6)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00d1b2'
                    }
                  }}
                >
                  {selectedPath &&
                    getSubOptions(selectedPath).map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#cfeefe' }}>Specific</InputLabel>
                <Select
                  value={selectedSpecific}
                  onChange={(e) => setSelectedSpecific(e.target.value)}
                  disabled={!selectedPath || !selectedSubpath}
                  sx={{
                    color: '#cfeefe',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(100,210,255,0.36)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(100,210,255,0.6)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00d1b2'
                    }
                  }}
                >
                  {selectedPath && selectedSubpath &&
                    getSpecificOptions(selectedPath, selectedSubpath).map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            {/* Quiz Content */}

            {quizLoading ? (
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <CircularProgress sx={{ color: '#00d1b2' }} />
              </Box>
            ) : quizQuestions.length === 0 ? (
              <Typography sx={{ color: '#cfeefe' }}>
                {selectedPath && selectedSubpath && selectedSpecific
                  ? 'No questions available for this selection. Please choose a different combination.'
                  : 'Select Path, Subpath, and Specific to start the quiz.'}
              </Typography>
            ) : (
              <>
                <Typography
                  sx={{ color: '#aef', mb: 1, fontWeight: 700 }}
                >
                  Difficulty:{' '}
                  {['Easy', 'Medium', 'Hard'][
                    Math.min(
                      Math.floor((streaks.dailyChallengeStreak || 0) / 7),
                      2
                    )
                  ]}
                </Typography>
                {quizQuestions.map((q) => (
                  <Box key={q.id} sx={{ mb: 2 }}>
                    <Typography
                      sx={{ color: '#e6fbff', fontWeight: 700, mb: 1 }}
                    >
                      {q.id}. {q.question}
                    </Typography>
                    {q.options.map((opt, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                          p: 0.5,
                          borderRadius: 1,
                          backgroundColor: showCorrectAnswers && idx === q.correct ? 'rgba(0, 209, 178, 0.2)' : 'transparent',
                          border: showCorrectAnswers && idx === q.correct ? '1px solid #00d1b2' : 'none'
                        }}
                      >
                        <input
                          type="radio"
                          id={`q${q.id}o${idx}`}
                          name={`q${q.id}`}
                          checked={userAnswers[q.id] === idx}
                          onChange={() => handleAnswer(q.id, idx)}
                          disabled={showCorrectAnswers}
                        />
                        <label
                          htmlFor={`q${q.id}o${idx}`}
                          style={{ color: '#cfeefe' }}
                        >
                          {opt}
                        </label>
                        {showCorrectAnswers && idx === q.correct && (
                          <Typography sx={{ color: '#00d1b2', fontSize: '0.8rem' }}>
                            ✓ Correct
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                ))}
                <Button
                  variant="contained"
                  onClick={showCorrectAnswers ? () => setShowQuizModal(false) : submitQuiz}
                  disabled={
                    !showCorrectAnswers && (
                      quizQuestions.length === 0 ||
                      !quizQuestions.every(
                        (q) => typeof userAnswers[q.id] === 'number'
                      )
                    )
                  }
                  sx={{
                    background: 'linear-gradient(90deg,#00d1b2,#007cff)',
                    fontWeight: 800
                  }}
                >
                  {showCorrectAnswers ? 'Close' : 'Submit Answers'}
                </Button>
              </>
            )}
          </Box>
        </Modal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              color: 'white'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Streaks;
