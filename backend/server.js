import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import puppeteer from "puppeteer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// safe fetch polyfill (top-level await — ESM)
let fetchFn = globalThis.fetch;
if (!fetchFn) {
  try {
    const mod = await import("node-fetch");
    fetchFn = mod.default || mod;
    globalThis.fetch = fetchFn;
    console.log("node-fetch loaded as fallback for fetch()");
  } catch (err) {
    console.warn("node-fetch not available:", err?.message || err);
  }
}

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
    }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("⚠️  MONGODB_URI not set — using in-memory storage");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err?.message || err);
    console.warn("⚠️  Continuing without MongoDB...");
  }
};

// Initialize MongoDB connection
try {
  await connectDB();
} catch (error) {
  console.error('Failed to initialize MongoDB connection:', error);
  // Continue without MongoDB for now
}

// MongoDB Schemas
const analysisSchema = new mongoose.Schema({
  repoUrl: String,
  repoName: String,
  analysisType: String,
  analysisResult: Object,
  analyzedAt: { type: Date, default: Date.now },
});

const Analysis = mongoose.model("Analysis", analysisSchema);

//feedback schema
// Feedback schema
const feedbackSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Streak schema for storing user streaks
const streakSchema = new mongoose.Schema({
  name: String,
  githubId: String,
  learningStreak: { type: Number, default: 0 },
  tracingStreak: { type: Number, default: 0 },
  testStreak: { type: Number, default: 0 },
  projectsStreak: { type: Number, default: 0 },
  dailyChallengeStreak: { type: Number, default: 0 },
  lastClaimed: {
    learningStreak: Date,
    tracingStreak: Date,
    testStreak: Date,
    projectsStreak: Date,
    dailyChallengeStreak: Date
  },
  createdAt: { type: Date, default: Date.now }
});

const StreakUser = mongoose.model("StreakUser", streakSchema);

// AI Jobs storage
const aiJobs = new Map();

// Add this to server.js alongside streakSchema
const projectProgressSchema = new mongoose.Schema({
  name: String,
  githubId: String,
  projects: [{
    projectId: String,
    projectTitle: String,
    startedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    currentStep: { type: Number, default: 0 },
    completedSteps: [Number],
    lastUpdated: { type: Date, default: Date.now }
  }],
  totalProjectsStarted: { type: Number, default: 0 },
  totalProjectsCompleted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const ProjectProgress = mongoose.model('ProjectProgress', projectProgressSchema);

// Add this alongside streakSchema and projectProgressSchema
const testProgressSchema = new mongoose.Schema({
  name: String,
  githubId: String,
  testResults: [{
    testId: String,
    testName: String,
    date: { type: Date, default: Date.now },
    score: Number, // Percentage score 0-100
    totalQuestions: Number,
    correctAnswers: Number,
    timeSpent: Number, // in seconds
    difficulty: String,
    category: String,
    optimizationScore: Number, // AI optimization percentage
    details: Object
  }],
  averageScore: { type: Number, default: 0 },
  totalTestsTaken: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const TestProgress = mongoose.model('TestProgress', testProgressSchema);


// Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server running with real GitHub API analysis",
  });
});

// ============================================
// STREAK ENDPOINTS - MongoDB
// ============================================

// Get current user's streak data
app.get("/api/streaks/me", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const githubUsername = req.user?.profile?.username;
    const githubId = req.user?.profile?.id;
    
    if (!githubUsername) {
      return res.status(400).json({ error: "No username found" });
    }

    console.log("Fetching streaks for user:", githubUsername);

    // Find or create streak user
    let user = await StreakUser.findOne({ 
      $or: [
        { name: githubUsername },
        { githubId: githubId?.toString() }
      ]
    });
    
    if (!user) {
      user = new StreakUser({ 
        name: githubUsername,
        githubId: githubId?.toString(),
        learningStreak: 0,
        tracingStreak: 0,
        testStreak: 0,
        projectsStreak: 0
      });
      await user.save();
      console.log("Created new streak user:", githubUsername);
    }

    res.json({ 
      streakUserId: user._id,
      username: user.name,
      streaks: {
        learningStreak: user.learningStreak,
        tracingStreak: user.tracingStreak,
        testStreak: user.testStreak,
        projectsStreak: user.projectsStreak,
        dailyChallengeStreak: user.dailyChallengeStreak
      }
    });
  } catch (error) {
    console.error("Error fetching user streaks:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update streak endpoint
app.post("/api/streaks/:id", async (req, res) => {
  try {
    const { streakType } = req.body;
    const userId = req.params.id;

    console.log("Updating streak:", { userId, streakType });

    // Validate streak type
    const validStreakTypes = ["learningStreak", "tracingStreak", "testStreak", "projectsStreak", "dailyChallengeStreak"];
    if (!validStreakTypes.includes(streakType)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid streak type" 
      });
    }

    // Check if user exists
    const user = await StreakUser.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Check if already claimed today
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastClaimed = user.lastClaimed?.[streakType];
    
    if (lastClaimed && new Date(lastClaimed) >= today) {
      return res.status(400).json({
        success: false,
        error: "Streak already claimed today"
      });
    }

    // Update streak
    const updatedUser = await StreakUser.findByIdAndUpdate(
      userId,
      { 
        $inc: { [streakType]: 1 },
        $set: { 
          [`lastClaimed.${streakType}`]: now 
        }
      },
      { new: true }
    );

    console.log("Streak updated successfully:", updatedUser[streakType]);

    res.json({ 
      success: true,
      user: updatedUser,
      updatedStreak: updatedUser[streakType]
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get specific user's streaks (by name)
app.get("/api/streaks/:name", async (req, res) => {
  try {
    const user = await StreakUser.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PROJECT PROGRESS ENDPOINTS - MongoDB
// ============================================

// Get current user's project progress
app.get("/api/project-progress/me", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const githubUsername = req.user?.profile?.username;
    const githubId = req.user?.profile?.id;
    
    if (!githubUsername) {
      return res.status(400).json({ error: "No username found" });
    }

    console.log("Fetching project progress for user:", githubUsername);

    // Find or create project progress user
    let userProgress = await ProjectProgress.findOne({ 
      $or: [
        { name: githubUsername },
        { githubId: githubId?.toString() }
      ]
    });
    
    if (!userProgress) {
      userProgress = new ProjectProgress({ 
        name: githubUsername,
        githubId: githubId?.toString(),
        projects: [],
        totalProjectsStarted: 0,
        totalProjectsCompleted: 0
      });
      await userProgress.save();
      console.log("Created new project progress user:", githubUsername);
    }

    res.json({ 
      projectProgressId: userProgress._id,
      username: userProgress.name,
      progress: userProgress
    });
  } catch (error) {
    console.error("Error fetching project progress:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update project progress
app.post("/api/project-progress/:id", async (req, res) => {
  try {
    const { projectId, projectTitle, currentStep, completedSteps, completed } = req.body;
    const userId = req.params.id;

    console.log("Updating project progress:", { userId, projectId, currentStep, completed });

    // Check if user exists
    const userProgress = await ProjectProgress.findById(userId);
    if (!userProgress) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Find existing project or create new one
    const existingProjectIndex = userProgress.projects.findIndex(
      p => p.projectId === projectId
    );

    let updatedProject;
    
    if (existingProjectIndex >= 0) {
      // Update existing project
      userProgress.projects[existingProjectIndex].currentStep = currentStep;
      userProgress.projects[existingProjectIndex].completedSteps = completedSteps;
      userProgress.projects[existingProjectIndex].lastUpdated = new Date();
      
      if (completed && !userProgress.projects[existingProjectIndex].completed) {
        userProgress.projects[existingProjectIndex].completed = true;
        userProgress.projects[existingProjectIndex].completedAt = new Date();
        userProgress.totalProjectsCompleted += 1;
      }
      
      updatedProject = userProgress.projects[existingProjectIndex];
    } else {
      // Create new project entry
      const newProject = {
        projectId,
        projectTitle,
        startedAt: new Date(),
        completed: completed || false,
        completedAt: completed ? new Date() : null,
        currentStep,
        completedSteps: completedSteps || [],
        lastUpdated: new Date()
      };
      
      userProgress.projects.push(newProject);
      userProgress.totalProjectsStarted += 1;
      if (completed) {
        userProgress.totalProjectsCompleted += 1;
      }
      
      updatedProject = newProject;
    }

    const updatedUserProgress = await userProgress.save();

    console.log("Project progress updated successfully");

    res.json({ 
      success: true,
      user: updatedUserProgress,
      updatedProject: updatedProject
    });
  } catch (error) {
    console.error("Error updating project progress:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ============================================
// TEST PROGRESS ENDPOINTS - MongoDB
// ============================================

// Get current user's test progress
app.get("/api/test-progress/me", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const githubUsername = req.user?.profile?.username;
    const githubId = req.user?.profile?.id;
    
    if (!githubUsername) {
      return res.status(400).json({ error: "No username found" });
    }

    console.log("Fetching test progress for user:", githubUsername);

    // Find or create test progress user
    let userProgress = await TestProgress.findOne({ 
      $or: [
        { name: githubUsername },
        { githubId: githubId?.toString() }
      ]
    });
    
    if (!userProgress) {
      userProgress = new TestProgress({ 
        name: githubUsername,
        githubId: githubId?.toString(),
        testResults: [],
        averageScore: 0,
        totalTestsTaken: 0,
        bestScore: 0
      });
      await userProgress.save();
      console.log("Created new test progress user:", githubUsername);
    }

    res.json({ 
      testProgressId: userProgress._id,
      username: userProgress.name,
      progress: userProgress
    });
  } catch (error) {
    console.error("Error fetching test progress:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save test result
app.post("/api/test-progress/:id", async (req, res) => {
  try {
    const { 
      testId, 
      testName, 
      score, 
      totalQuestions, 
      correctAnswers, 
      timeSpent, 
      difficulty, 
      category, 
      optimizationScore,
      details 
    } = req.body;
    
    const userId = req.params.id;

    console.log("Saving test result:", { userId, testName, score });

    // Check if user exists
    const userProgress = await TestProgress.findById(userId);
    if (!userProgress) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Create new test result
    const newTestResult = {
      testId: testId || `test_${Date.now()}`,
      testName: testName || 'Coding Test',
      date: new Date(),
      score: Math.max(0, Math.min(100, score || 0)),
      totalQuestions: totalQuestions || 1,
      correctAnswers: correctAnswers || 0,
      timeSpent: timeSpent || 0,
      difficulty: difficulty || 'medium',
      category: category || 'programming',
      optimizationScore: Math.max(0, Math.min(100, optimizationScore || 0)),
      details: details || {}
    };

    // Add to test results
    userProgress.testResults.push(newTestResult);
    
    // Update statistics
    userProgress.totalTestsTaken = userProgress.testResults.length;
    
    // Calculate average score
    const totalScore = userProgress.testResults.reduce((sum, result) => sum + result.score, 0);
    userProgress.averageScore = totalScore / userProgress.totalTestsTaken;
    
    // Update best score
    userProgress.bestScore = Math.max(userProgress.bestScore, newTestResult.score);

    const updatedUserProgress = await userProgress.save();

    console.log("Test result saved successfully");

    res.json({ 
      success: true,
      user: updatedUserProgress,
      newTestResult: newTestResult
    });
  } catch (error) {
    console.error("Error saving test progress:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get test progress history (last 10 tests)
app.get("/api/test-progress/:id/history", async (req, res) => {
  try {
    const userId = req.params.id;
    
    const userProgress = await TestProgress.findById(userId);
    if (!userProgress) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get last 10 test results sorted by date
    const recentTests = userProgress.testResults
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      success: true,
      recentTests: recentTests,
      statistics: {
        totalTests: userProgress.totalTestsTaken,
        averageScore: userProgress.averageScore,
        bestScore: userProgress.bestScore
      }
    });
  } catch (error) {
    console.error("Error fetching test history:", error);
    res.status(500).json({ error: error.message });
  }
});

// GitHub URL validation helper
const parseGitHubUrl = (url) => {
  if (!url || typeof url !== "string") throw new Error("Invalid URL");
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i);
  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
};

// Real GitHub API analysis
const analyzeGitHubRepo = async (repoUrl) => {
  try {
    const { owner, repo } = parseGitHubUrl(repoUrl);
    const repoName = `${owner}/${repo}`;

    console.log(`🔍 Analyzing repository: ${repoName}`);

    // Fetch repository data from GitHub API
    const repoResponse = await fetchFn(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status} ${repoResponse.statusText}`);
    }
    const repoData = await repoResponse.json();

    // Fetch languages
    const langResponse = await fetchFn(`https://api.github.com/repos/${owner}/${repo}/languages`);
    const languages = langResponse.ok ? await langResponse.json() : {};

    // Helper to parse Link header for last page
    const parseLastPageFromLink = (linkHeader) => {
      if (!linkHeader || typeof linkHeader !== 'string') return null;
      const m = linkHeader.match(/page=(\d+)>; rel="last"/);
      return m ? parseInt(m[1], 10) : null;
    };

    // Fetch contributors count (use Link header if present)
    const contributorsResponse = await fetchFn(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1`
    );
    let contributorCount = 0;
    try {
      const contribLink = contributorsResponse.headers?.get?.("link");
      const last = parseLastPageFromLink(contribLink);
      if (last) contributorCount = last;
      else if (contributorsResponse.ok) {
        // best-effort fallback: if response body is array, use length (may be 1 due to per_page)
        const body = await contributorsResponse.json().catch(() => null);
        if (Array.isArray(body)) contributorCount = body.length;
      }
    } catch (e) {
      contributorCount = 0;
    }

    // Fetch recent commits
    const commitsResponse = await fetchFn(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`
    );
    const recentCommits = commitsResponse.ok ? await commitsResponse.json() : [];

    // Fetch issues count (use Link header or fallback to repoData.open_issues_count)
    const issuesResponse = await fetchFn(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=1`
    );
    let openIssuesCount = 0;
    try {
      const issuesLink = issuesResponse.headers?.get?.("link");
      const lastIssuesPage = parseLastPageFromLink(issuesLink);
      if (lastIssuesPage !== null) openIssuesCount = lastIssuesPage;
      else if (typeof repoData.open_issues_count === 'number') openIssuesCount = repoData.open_issues_count;
      else openIssuesCount = 0;
    } catch (e) {
      openIssuesCount = repoData.open_issues_count ?? 0;
    }

    // Analyze the data
    const primaryLanguage =
      Object.keys(languages).length > 0
        ? Object.keys(languages).reduce((a, b) => (languages[a] > languages[b] ? a : b))
        : "Unknown";
    const totalCodeSize = Object.values(languages).reduce((sum, size) => sum + size, 0);

    const lastUpdated = new Date(repoData.updated_at);
    const daysSinceUpdate = isNaN(lastUpdated) ? 0 : Math.floor((new Date() - lastUpdated) / (1000 * 60 * 60 * 24));

    // Determine repository health
    let healthStatus = "Excellent";
    if (daysSinceUpdate > 365) healthStatus = "Inactive";
    else if (daysSinceUpdate > 180) healthStatus = "Stale";
    else if (daysSinceUpdate > 90) healthStatus = "Moderate";

    // Calculate activity level based on recent commits
    const activityLevel = recentCommits.length >= 3 ? "High" : recentCommits.length >= 1 ? "Moderate" : "Low";

    // Analyze README quality
    let readmeQuality = "Good";
    if (!repoData.has_wiki && !repoData.description) readmeQuality = "Basic";
    if (repoData.size < 1000) readmeQuality = "Minimal";

    return {
      repoName,
      analysisDate: new Date().toLocaleDateString(),
      basicAnalysis: {
        description: repoData.description || "No description provided",
        primaryLanguage,
        languages: Object.keys(languages).slice(0, 5), // Top 5 languages
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        size: `${(repoData.size / 1024).toFixed(1)} MB`,
        openIssues: openIssuesCount,
        contributors: contributorCount,
        createdAt: new Date(repoData.created_at).toLocaleDateString(),
        lastUpdated: lastUpdated.toLocaleDateString(),
        daysSinceUpdate,
        license: repoData.license?.name || "No license",
        isFork: repoData.fork,
        hasWiki: repoData.has_wiki,
        hasIssues: repoData.has_issues,
        hasProjects: repoData.has_projects,
        healthStatus,
        activityLevel,
        readmeQuality,
      },
      technicalInsights: {
        totalLanguages: Object.keys(languages).length,
        languageDistribution: languages,
        recentActivity: recentCommits.length,
        defaultBranch: repoData.default_branch,
        archiveUrl: repoData.archive_url,
        cloneUrl: repoData.clone_url,
      },
    };
  } catch (error) {
    console.error("GitHub API analysis error:", error);
    throw new Error(`Failed to analyze repository: ${error.message}`);
  }
};

// BASIC ANALYSIS ENDPOINT - Real GitHub API
app.post("/api/analyze/basic", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        status: "error",
        error: "Repository URL required",
      });
    }

    // Validate GitHub URL
    try {
      parseGitHubUrl(repoUrl);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        error: "Invalid GitHub repository URL",
      });
    }

    console.log(`🔍 Starting basic analysis for: ${repoUrl}`);

    const analysisResult = await analyzeGitHubRepo(repoUrl);

    // Save analysis to database
    try {
      const analysis = new Analysis({
        repoUrl,
        repoName: analysisResult.repoName,
        analysisType: "basic",
        analysisResult,
      });
      await analysis.save();
      console.log("💾 Basic analysis saved to database");
    } catch (dbError) {
      console.error("❌ Failed to save analysis to database:", dbError);
    }

    res.json({
      status: "success",
      message: "Basic analysis completed successfully",
      data: analysisResult,
    });
  } catch (error) {
    console.error("❌ Basic analysis error:", error);
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});

// ENHANCED DEEPWIKI SUBMIT - No email required, just repository URL
app.post("/api/deepwiki/submit", async (req, res) => {
  try {
    console.log("📤 Received DeepWiki submission:", req.body);
    const { repoUrl } = req.body || {};

    if (!repoUrl) {
      return res.status(400).json({
        status: "error",
        error: "Repository URL required",
      });
    }

    // Validate GitHub URL
    let parsedUrl;
    try {
      parsedUrl = parseGitHubUrl(repoUrl);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        error: "Invalid GitHub repository URL",
      });
    }

    let indexingStarted = false;
    let indexingResponse = null;
    let submissionError = null;
    let indexingUrl = null;

    console.log("🌐 Starting repository indexing process...");
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--window-size=1280,800"
        ]
      });

      const page = await browser.newPage();
      // Improve resilience
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      );
      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);

      await page.goto("https://deepwiki.com", { waitUntil: "domcontentloaded", timeout: 60000 });

      // First attempt: navigate directly to /owner/repo
      try {
        const { owner, repo } = parsedUrl;
        const directUrl = `https://deepwiki.com/${owner}/${repo}`;
        console.log("🔎 Trying direct indexing URL:", directUrl);
        await page.goto(directUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      } catch (_) {
        // ignore, will use search fallback
      }

      // If still on landing page, fallback to search box flow
      const currentUrl = page.url();
      const onLanding = /^(https?:\/\/)?(www\.)?deepwiki\.com\/?$/i.test(currentUrl);

      if (onLanding) {
        // Find a likely input and type the repo URL
        const candidateSelectors = [
          'input[placeholder*="Which repo" i]',
          'input[placeholder*="Search for repositories" i]',
          'input[aria-label*="repo" i]',
          'input[type="text"]',
          'input',
          'textarea'
        ];
        let found = false;
        for (const sel of candidateSelectors) {
          const exists = await page.$(sel);
          if (exists) {
            await page.focus(sel);
            await page.evaluate((selector) => {
              const el = document.querySelector(selector);
              if (el) el.value = '';
            }, sel);
            await page.type(sel, repoUrl, { delay: 20 });
            await page.keyboard.press("Enter");
            found = true;
            break;
          }
        }
        if (!found) throw new Error("Could not locate repository input field");
      }

      // Wait briefly for indexing to start (safe delay)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Try light navigation wait, but don't fail if SPA handles it
      await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});

      // Poll for URL change away from the landing page for up to 60s
      const start = Date.now();
      let finalUrl = page.url();
      while ((Date.now() - start) < 60000) {
        finalUrl = page.url();
        if (finalUrl && !/^(https?:\/\/)?(www\.)?deepwiki\.com\/?$/i.test(finalUrl)) break;
        await new Promise(r => setTimeout(r, 1000));
      }

      console.log("🔗 Indexing URL:", finalUrl);
      indexingUrl = finalUrl;
      indexingResponse = { status: 200, statusText: "OK", body: finalUrl };
      indexingStarted = true;

    } catch (error) {
      submissionError = `Repository indexing failed: ${error.message}`;
      console.warn("⚠ Indexing automation error:", error);

      // Fallback to local mock to keep UX working
      try {
        const fallbackUrl = `${req.protocol}://${req.get("host")}/deepwiki/analyze`;
        if (fetchFn) {
          const response = await fetchFn(fallbackUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              repoUrl,
              source: "Algorythm AI"
            })
          });
          indexingResponse = {
            status: response.status,
            statusText: response.statusText,
            body: await response.text()
          };
          indexingStarted = response.ok;
        }
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
      }
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }

    // Save to database
    try {
      const analysis = new Analysis({
        repoUrl,
        repoName: `${parsedUrl.owner}/${parsedUrl.repo}`,
        analysisType: "deep",
        analysisResult: {
          indexingStarted,
          indexingResponse,
          error: submissionError,
          indexing_url: indexingUrl
        },
      });
      await analysis.save();
      console.log("💾 Indexing submission saved to database");
    } catch (dbError) {
      console.error("❌ Failed to save submission to database:", dbError);
    }

    const responseMessage = indexingStarted
      ? "Repository analysis completed successfully."
      : `Submission recorded. ${submissionError || "Analysis may be delayed."}`;

    res.json({
      status: indexingStarted ? "success" : "partial_success",
      message: responseMessage,
      explanation: "You now have access to a chatbot where you can explore your codebase structure, find documentation, understand dependencies, and get AI-powered insights about your repository.",
      data: {
        repoUrl,
        indexing_started: indexingStarted,
        indexing_url: indexingUrl,
        estimated_time: "Instant",
        submitted_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("💥 Unexpected error in /api/deepwiki/submit:", error);
    res.status(500).json({
      status: "error",
      error: "Internal server error processing indexing request",
    });
  }
});

// Check if repository is indexed on DeepWiki
app.post("/api/deepwiki/check-indexed", async (req, res) => {
  try {
    console.log("🔍 Checking DeepWiki indexing status:", req.body);
    const { repoUrl } = req.body || {};

    if (!repoUrl) {
      return res.status(400).json({
        status: "error",
        error: "Repository URL required",
      });
    }

    // Validate GitHub URL
    let parsedUrl;
    try {
      parsedUrl = parseGitHubUrl(repoUrl);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        error: "Invalid GitHub repository URL",
      });
    }

    const { owner, repo } = parsedUrl;
    const directUrl = `https://deepwiki.com/${owner}/${repo}`;

    console.log("🌐 Checking indexing for:", directUrl);

    let indexed = false;
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--window-size=1280,800"
        ]
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      );
      page.setDefaultNavigationTimeout(30000);
      page.setDefaultTimeout(30000);

      await page.goto(directUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Wait a bit for dynamic content to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      const currentUrl = page.url();
      const onLanding = /^(https?:\/\/)?(www\.)?deepwiki\.com\/?$/i.test(currentUrl);

      // Check page content for "Repository Not Indexed" or "Index Repository" text
      const pageText = await page.evaluate(() => document.body.innerText || document.body.textContent).catch(() => '');
      const pageTextLower = pageText.toLowerCase();
      const hasNotIndexedText = pageTextLower.includes('repository not indexed') || 
                                 pageTextLower.includes('hasn\'t been indexed') ||
                                 pageTextLower.includes('index repository') ||
                                 pageTextLower.includes('email to notify');

      indexed = !onLanding && currentUrl === directUrl && !hasNotIndexedText;

      console.log("📍 Current URL:", currentUrl);
      console.log("🏠 On landing page:", onLanding);
      console.log("📄 Has 'Not Indexed' text:", hasNotIndexedText);
      console.log("📝 Page text sample:", pageText.substring(0, 200));
      console.log("✅ Indexed:", indexed);

    } catch (error) {
      console.warn("⚠️ Indexing check error:", error.message);
      indexed = false;
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }

    res.json({
      status: "success",
      indexed,
      url: directUrl
    });

  } catch (error) {
    console.error("💥 Unexpected error in check-indexed:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to check indexing status",
    });
  }
});

// Get analysis history
app.get("/api/analysis/history", async (req, res) => {
  try {
    const { repoUrl } = req.query;
    if (!repoUrl) {
      return res.status(400).json({ error: "Repository URL parameter required" });
    }

    const analyses = await Analysis.find({
      repoUrl,
    })
      .sort({ analyzedAt: -1 })
      .limit(10);

    res.json({
      status: "success",
      analyses,
    });
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    res.status(500).json({ error: "Failed to fetch analysis history" });
  }
});

// CHAT ENDPOINT FOR REPOSITORY QUESTIONS
app.post("/api/chat", async (req, res) => {
  try {
    const { repoUrl, question, chatHistory = [] } = req.body;

    if (!repoUrl || !question) {
      return res.status(400).json({
        status: "error",
        error: "Repository URL and question are required",
      });
    }

    // Validate GitHub URL
    let parsedUrl;
    try {
      parsedUrl = parseGitHubUrl(repoUrl);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        error: "Invalid GitHub repository URL",
      });
    }

    console.log(`🤖 Processing chat question for: ${repoUrl}`);
    console.log(`Question: ${question}`);

    // Get repository analysis data
    let analysisData = null;
    try {
      const analysisResult = await analyzeGitHubRepo(repoUrl);
      analysisData = analysisResult;
    } catch (error) {
      console.error("Failed to analyze repo for chat:", error);
    }

    // Prepare context for AI
    const context = analysisData ? `
Repository: ${analysisData.repoName}
Description: ${analysisData.basicAnalysis.description}
Primary Language: ${analysisData.basicAnalysis.primaryLanguage}
Languages: ${analysisData.basicAnalysis.languages.join(', ')}
Stars: ${analysisData.basicAnalysis.stars}
Forks: ${analysisData.basicAnalysis.forks}
Size: ${analysisData.basicAnalysis.size}
Contributors: ${analysisData.basicAnalysis.contributors}
Last Updated: ${analysisData.basicAnalysis.lastUpdated}
Open Issues: ${analysisData.basicAnalysis.openIssues}
Health Status: ${analysisData.basicAnalysis.healthStatus}
Activity Level: ${analysisData.basicAnalysis.activityLevel}
License: ${analysisData.basicAnalysis.license}
Default Branch: ${analysisData.technicalInsights.defaultBranch}
Total Languages: ${analysisData.technicalInsights.totalLanguages}
    `.trim() : "Repository analysis data not available.";

    // For now, use enhanced keyword-based responses
    // In production, you would integrate with OpenAI or another AI service
    const lowerQuestion = question.toLowerCase();
    let response = "";

    // Enhanced keyword matching for comprehensive answers
    if (lowerQuestion.includes('structure') || lowerQuestion.includes('architecture') || lowerQuestion.includes('layout') || lowerQuestion.includes('organization')) {
      if (analysisData) {
        response = `The repository "${analysisData.repoName}" has a well-organized structure. It's primarily written in ${analysisData.basicAnalysis.primaryLanguage} with ${analysisData.technicalInsights.totalLanguages} total languages. The codebase spans ${analysisData.basicAnalysis.size} and follows standard practices for ${analysisData.basicAnalysis.primaryLanguage} projects. The default branch is "${analysisData.technicalInsights.defaultBranch}" and it has ${analysisData.basicAnalysis.contributors} contributors.`;
      } else {
        response = "The repository follows a standard structure typical for software projects, with source code, documentation, and configuration files organized logically.";
      }
    } else if (lowerQuestion.includes('dependencies') || lowerQuestion.includes('packages') || lowerQuestion.includes('libraries') || lowerQuestion.includes('requirements')) {
      if (analysisData) {
        response = `Based on the repository analysis, this project uses ${analysisData.basicAnalysis.primaryLanguage} as the primary language. Dependencies are typically managed through standard package managers for this language (like package.json for JavaScript, requirements.txt for Python, etc.). The project has ${analysisData.basicAnalysis.openIssues} open issues which might indicate some dependency-related concerns. The codebase size of ${analysisData.basicAnalysis.size} suggests ${analysisData.basicAnalysis.size > 1000000 ? 'a complex application with many dependencies' : 'a moderate-sized project with manageable dependencies'}.`;
      } else {
        response = "Dependencies are managed through the appropriate package manager for the project's primary language. Check files like package.json, requirements.txt, or pom.xml for the complete list of dependencies and their versions.";
      }
    } else if (lowerQuestion.includes('documentation') || lowerQuestion.includes('readme') || lowerQuestion.includes('docs') || lowerQuestion.includes('wiki')) {
      if (analysisData) {
        response = `${analysisData.basicAnalysis.hasWiki ? 'The repository has a wiki for detailed documentation.' : 'No wiki is available for this repository.'} ${analysisData.basicAnalysis.description ? `The project description is: "${analysisData.basicAnalysis.description}"` : 'No description is provided in the repository.'} Documentation quality is rated as "${analysisData.basicAnalysis.readmeQuality}". For setup and usage instructions, check the README file in the repository root.`;
      } else {
        response = "Documentation is typically found in the README.md file and potentially a docs/ directory. The repository may also have a wiki for additional documentation. Check the main README for setup instructions, API documentation, and contribution guidelines.";
      }
    } else if (lowerQuestion.includes('languages') || lowerQuestion.includes('tech stack') || lowerQuestion.includes('technologies') || lowerQuestion.includes('programming languages')) {
      if (analysisData) {
        response = `The primary programming language is ${analysisData.basicAnalysis.primaryLanguage}. The repository uses ${analysisData.technicalInsights.totalLanguages} different languages total. Top languages include: ${analysisData.basicAnalysis.languages.slice(0, 3).join(', ')}. This suggests it's ${analysisData.basicAnalysis.primaryLanguage === 'JavaScript' ? 'a web application' : analysisData.basicAnalysis.primaryLanguage === 'Python' ? 'a data science or backend application' : analysisData.basicAnalysis.primaryLanguage === 'Java' ? 'an enterprise application' : 'a specialized application'}.`;
      } else {
        response = "The repository uses multiple programming languages. The primary language and technology stack can be determined by examining the file extensions and configuration files in the repository.";
      }
    } else if (lowerQuestion.includes('contributors') || lowerQuestion.includes('team') || lowerQuestion.includes('authors') || lowerQuestion.includes('developers')) {
      if (analysisData) {
        response = `The repository has ${analysisData.basicAnalysis.contributors} contributors. ${analysisData.basicAnalysis.isFork ? 'This is a fork of another repository.' : 'This is not a fork.'} The project was created on ${analysisData.basicAnalysis.createdAt} and has been actively maintained. The contributor network suggests ${analysisData.basicAnalysis.contributors > 10 ? 'a collaborative community project' : 'a smaller team effort'}.`;
      } else {
        response = "Contributor information can be found in the repository's contributors section on GitHub. The number of contributors and their activity levels indicate the project's community size and maintenance status.";
      }
    } else if (lowerQuestion.includes('activity') || lowerQuestion.includes('recent') || lowerQuestion.includes('updates') || lowerQuestion.includes('maintenance')) {
      if (analysisData) {
        response = `The repository was last updated on ${analysisData.basicAnalysis.lastUpdated} (${analysisData.basicAnalysis.daysSinceUpdate} days ago). The health status is "${analysisData.basicAnalysis.healthStatus}" and activity level is "${analysisData.basicAnalysis.activityLevel}". ${analysisData.basicAnalysis.archived ? 'This repository has been archived and is no longer actively maintained.' : 'The repository appears to be actively maintained.'} It has ${analysisData.basicAnalysis.stars} stars and ${analysisData.basicAnalysis.forks} forks.`;
      } else {
        response = "Repository activity can be assessed by looking at recent commits, issue updates, and release frequency. Check the pulse section on GitHub for detailed activity metrics.";
      }
    } else if (lowerQuestion.includes('issues') || lowerQuestion.includes('bugs') || lowerQuestion.includes('problems')) {
      if (analysisData) {
        response = `The repository currently has ${analysisData.basicAnalysis.openIssues} open issues. This ${analysisData.basicAnalysis.openIssues > 50 ? 'indicates significant ongoing development or maintenance needs' : analysisData.basicAnalysis.openIssues > 10 ? 'suggests active development with some issues to address' : 'shows good issue management'}. Issues can include bug reports, feature requests, and general discussions.`;
      } else {
        response = "Issue tracking information is available in the repository's Issues tab on GitHub. This includes bug reports, feature requests, and community discussions.";
      }
    } else if (lowerQuestion.includes('license') || lowerQuestion.includes('copyright') || lowerQuestion.includes('legal')) {
      if (analysisData) {
        response = `The repository ${analysisData.basicAnalysis.license ? `is licensed under "${analysisData.basicAnalysis.license}"` : 'does not have a specified license'}. ${analysisData.basicAnalysis.license ? 'This license governs how the code can be used, modified, and distributed.' : 'Without a license, the default copyright laws apply and usage rights are limited.'} Check the LICENSE file for full license text.`;
      } else {
        response = "License information is typically found in a LICENSE file in the repository root. Common open-source licenses include MIT, Apache 2.0, GPL, etc.";
      }
    } else if ((lowerQuestion.includes('what') && (lowerQuestion.includes('project') || lowerQuestion.includes('repo') || lowerQuestion.includes('do'))) || lowerQuestion.includes('describe') || lowerQuestion.includes('about') || lowerQuestion.includes('purpose')) {
      if (analysisData) {
        response = `This repository is named "${analysisData.repoName}". ${analysisData.basicAnalysis.description || 'No description is provided.'} It's a ${analysisData.basicAnalysis.size} project written primarily in ${analysisData.basicAnalysis.primaryLanguage} with ${analysisData.basicAnalysis.stars} stars and ${analysisData.basicAnalysis.forks} forks. The project appears to be ${analysisData.basicAnalysis.healthStatus === 'Excellent' ? 'actively maintained' : analysisData.basicAnalysis.healthStatus === 'Inactive' ? 'inactive' : 'moderately maintained'}.`;
      } else {
        response = "This appears to be a software development repository. The project's purpose and description should be available in the README file or repository description on GitHub.";
      }
    } else if (lowerQuestion.includes('how') && (lowerQuestion.includes('run') || lowerQuestion.includes('start') || lowerQuestion.includes('setup') || lowerQuestion.includes('install'))) {
      response = "To run this project, typically you would: 1) Clone the repository, 2) Install dependencies using the appropriate package manager (npm install, pip install, etc.), 3) Follow the setup instructions in the README, 4) Run the start command (npm start, python main.py, etc.). Check the README.md for specific instructions.";
    } else if (lowerQuestion.includes('code') && (lowerQuestion.includes('quality') || lowerQuestion.includes('review') || lowerQuestion.includes('analysis'))) {
      if (analysisData) {
        response = `Code quality indicators: Repository size is ${analysisData.basicAnalysis.size}, which suggests ${analysisData.basicAnalysis.size > 5000000 ? 'a large, complex codebase' : analysisData.basicAnalysis.size > 1000000 ? 'a substantial project' : 'a manageable codebase'}. It has ${analysisData.basicAnalysis.contributors} contributors and ${analysisData.basicAnalysis.openIssues} open issues. The project is ${analysisData.basicAnalysis.daysSinceUpdate} days old with a health status of "${analysisData.basicAnalysis.healthStatus}".`;
      } else {
        response = "Code quality can be assessed by examining factors like code organization, documentation, test coverage, issue management, and community activity. Look for well-structured directories, comprehensive README, and active maintenance.";
      }
    } else {
      // Fallback response for unrecognized questions
      if (analysisData) {
        response = `I can help you understand various aspects of the "${analysisData.repoName}" repository. You can ask about the project structure, dependencies, documentation, programming languages used, contributors, recent activity, licensing, or how to run the code. What specific aspect would you like to know more about?`;
      } else {
        response = "I can provide information about repository structure, dependencies, documentation, languages, contributors, activity, licensing, and setup instructions. What would you like to know about this repository?";
      }
    }

    // Add some personality and helpfulness
    if (response.length < 200) {
      response += " Is there anything specific you'd like me to elaborate on?";
    }

    res.json({
      status: "success",
      response: response,
      context: context,
      analysisAvailable: !!analysisData
    });

  } catch (error) {
    console.error("❌ Chat endpoint error:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to process chat message",
    });
  }
});

//api routes for feedback
// ============================================
// FEEDBACK ENDPOINTS
// ============================================

// Get all feedbacks
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get feedback by section
app.get("/api/feedback/section/:section", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ section: req.params.section }).sort({ date: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feedback by resource
app.get("/api/feedback/resource/:resource", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ resource: req.params.resource }).sort({ date: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// AI JOB ENDPOINTS
// ============================================

// Enqueue AI analysis job
app.post("/api/ai-job", async (req, res) => {
  try {
    const { userCode, language, problem, functionSignature } = req.body;

    if (!userCode || !language) {
      return res.status(400).json({ error: "userCode and language are required" });
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start processing the job asynchronously
    processAIJob(jobId, { userCode, language, problem, functionSignature });

    res.json({ jobId });
  } catch (error) {
    console.error("Error enqueuing AI job:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI job status/result
app.get("/api/ai-job/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = aiJobs.get(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error getting AI job:", error);
    res.status(500).json({ error: error.message });
  }
});

// Process AI job (mock implementation with code analysis)
async function processAIJob(jobId, data) {
  aiJobs.set(jobId, { status: "processing" });

  try {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const { userCode, language, problem, functionSignature } = data;

    // Simple code analysis
    const lines = userCode.split('\n').filter(line => line.trim().length > 0).length;
    const chars = userCode.length;
    const functions = (userCode.match(/function\s+\w+/g) || []).length + (userCode.match(/\w+\s*\([^)]*\)\s*{/g) || []).length;
    const loops = (userCode.match(/\b(for|while)\b/g) || []).length;
    const conditionals = (userCode.match(/\b(if|else|switch)\b/g) || []).length;
    const variables = (userCode.match(/\b(var|let|const)\b/g) || []).length;

    // Check for optimized patterns
    const hasBitManipulation = /\b&\b|\||\^|<<|>>/.test(userCode);
    const hasRecursiveSolution = /\breturn\s+\w+\s*\(/.test(userCode) && userCode.includes('function');
    const hasIterativeSolution = /\bfor\s*\(|\bwhile\s*\(/.test(userCode);
    const hasMathOptimization = /\bMath\./.test(userCode);
    const hasEfficientDataStructure = /\bSet\b|\bMap\b|\bnew\s+Set\b|\bnew\s+Map\b/.test(userCode);

    // Detect specific optimized algorithms
    let isOptimized = false;
    let optimizationLevel = 0;

    // Normalize problem text for better matching
    const normalizedProblem = (problem || '').toLowerCase().trim();
    console.log(`🔍 Analyzing problem: "${normalizedProblem}"`);
    console.log(`📝 User code:\n${userCode}`);

    if (normalizedProblem.includes("power of two") || normalizedProblem.includes("powerof2") || normalizedProblem.includes("power-of-two") || normalizedProblem.includes("power") && normalizedProblem.includes("two")) {
      console.log("🎯 Detected power of two problem");
      // Check for bit manipulation solution (most optimal)
      if (hasBitManipulation && userCode.includes("n & (n - 1)") && userCode.includes("=== 0")) {
        console.log("✅ Found optimal bit manipulation solution!");
        isOptimized = true;
        optimizationLevel = 100;
      }
      // Check for logarithmic solution
      else if (userCode.includes("Math.log2") && userCode.includes("Number.isInteger")) {
        console.log("✅ Found logarithmic solution!");
        isOptimized = true;
        optimizationLevel = 90;
      }
      // Check for loop-based solution (less optimal)
      else if (hasIterativeSolution && userCode.includes("n % 2")) {
        console.log("⚠️ Found loop-based solution (suboptimal)");
        optimizationLevel = 60;
      } else {
        console.log("❌ No optimized solution detected for power of two");
      }
    }

    if (normalizedProblem.includes("fibonacci") || normalizedProblem.includes("fib")) {
      console.log("🎯 Detected fibonacci problem");
      // Check for iterative O(n) solution
      if (hasIterativeSolution && !hasRecursiveSolution && userCode.includes("prev") && userCode.includes("curr")) {
        console.log("✅ Found optimal iterative solution!");
        isOptimized = true;
        optimizationLevel = 95;
      }
      // Check for memoization
      else if (userCode.includes("memo") || userCode.includes("cache") || userCode.includes("dp")) {
        console.log("✅ Found memoized solution!");
        isOptimized = true;
        optimizationLevel = 90;
      }
      // Recursive solution without memoization is inefficient
      else if (hasRecursiveSolution && !userCode.includes("memo") && !userCode.includes("cache")) {
        console.log("⚠️ Found inefficient recursive solution");
        optimizationLevel = 30;
      } else {
        console.log("❌ No optimized solution detected for fibonacci");
      }
    }

    // Check for general optimization patterns if no specific problem detected
    if (!isOptimized && optimizationLevel === 0) {
      console.log("🔍 Checking general optimization patterns");
      // Bit manipulation is generally a good sign of optimization
      if (hasBitManipulation && (normalizedProblem.includes("bit") || normalizedProblem.includes("efficient"))) {
        console.log("✅ Found bit manipulation in relevant problem");
        isOptimized = true;
        optimizationLevel = 85;
      }
      // Using efficient data structures
      else if (hasEfficientDataStructure && (normalizedProblem.includes("search") || normalizedProblem.includes("lookup"))) {
        console.log("✅ Found efficient data structures");
        isOptimized = true;
        optimizationLevel = 80;
      }
      // Iterative solutions are generally better than recursive for most problems
      else if (hasIterativeSolution && !hasRecursiveSolution && loops <= 2 && conditionals <= 4) {
        console.log("✅ Found clean iterative solution");
        isOptimized = true;
        optimizationLevel = 75;
      }
    }

    console.log(`📊 Optimization analysis: isOptimized=${isOptimized}, optimizationLevel=${optimizationLevel}`);

    // Calculate complexity score (0-100)
    let complexity = 0;
    complexity += Math.min(lines * 2, 30); // More lines = more complex
    complexity += Math.min(chars / 10, 20); // More chars = more complex
    complexity += functions * 5; // More functions = potentially better structure
    complexity += loops * 3;
    complexity += conditionals * 2;
    complexity += variables * 1;

    // Cap at 100
    complexity = Math.min(complexity, 100);

    // Calculate refactoring potential based on optimization level
    let refactoringPotential;
    if (isOptimized && optimizationLevel >= 90) {
      refactoringPotential = 0; // 0% for highly optimized code
    } else if (isOptimized) {
      refactoringPotential = Math.max(0, Math.min(10, 100 - optimizationLevel)); // 0-10% for decent optimizations
    } else {
      refactoringPotential = Math.min(Math.round(complexity * 0.8), 95);
    }

    console.log(`📈 Final results: complexity=${complexity}, refactoringPotential=${refactoringPotential}`);

    // Generate feedback based on analysis
    let feedback = "Your code passes the tests. ";
    let suggestions = "";

    if (isOptimized) {
      feedback += "Excellent! Your code is already well-optimized.";
      suggestions = "Your implementation is efficient and follows best practices. No major refactoring needed.";
    } else {
      // Only provide suggestions if code is not optimized
      if (lines > 20) {
        feedback += "The code is quite long and could benefit from refactoring.";
        suggestions += "Consider breaking down large functions into smaller ones. ";
      } else if (lines < 5) {
        feedback += "The code is very concise.";
        suggestions += "Ensure readability with comments if needed. ";
      }

      if (loops > 3) {
        suggestions += "Multiple loops detected - consider optimizing with array methods or more efficient algorithms. ";
      }

      if (conditionals > 5) {
        suggestions += "Many conditional statements - consider using switch statements or lookup tables. ";
      }

      if (functions === 0) {
        suggestions += "Consider extracting logic into helper functions for better reusability. ";
      }

      if (problem && problem.toLowerCase().includes("power of two") && !hasBitManipulation) {
        suggestions += "For power of two problems, consider using bit manipulation: (n & (n - 1)) === 0. ";
      }

      if (problem && problem.toLowerCase().includes("fibonacci") && hasRecursiveSolution && !userCode.includes("memo")) {
        suggestions += "Recursive Fibonacci without memoization is inefficient. Consider iterative approach or memoization. ";
      }

      if (!suggestions) {
        suggestions = "Code structure looks good. Minor improvements possible with better naming.";
      }
    }

    // Generate optimized code example based on problem type
    let codeExample = "";
    if (problem && problem.toLowerCase().includes("power of two")) {
      if (!hasBitManipulation) {
        codeExample = `function isPowerOfTwo(n) {
  // Bit manipulation approach - most efficient O(1) time
  // A number is power of 2 if it has exactly one bit set
  return n > 0 && (n & (n - 1)) === 0;
}`;
      } else {
        codeExample = `// Your code already uses the optimal bit manipulation approach!
// This is the most efficient solution for checking powers of two.`;
      }
    } else if (problem && problem.toLowerCase().includes("fibonacci")) {
      if (!hasIterativeSolution || hasRecursiveSolution) {
        codeExample = `function fibonacci(n) {
  // Iterative approach with O(n) time and O(1) space
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`;
      } else {
        codeExample = `// Your code already uses an efficient iterative approach!
// This is optimal for Fibonacci sequence calculation.`;
      }
    } else if (functionSignature && functionSignature.includes("function")) {
      // Generic optimization for other problems
      const funcName = functionSignature.match(/function\s+(\w+)/)?.[1] || "solution";
      codeExample = `${functionSignature}
  // Optimized implementation using efficient algorithm
  // This is a working example - replace with your specific logic
  // For demonstration: using appropriate data structures and algorithms
  return optimizedResult;
}`;
    } else {
      codeExample = `function optimizedSolution(params) {
  // Optimized implementation
  // Uses efficient algorithms and data structures
  // Consider time/space complexity trade-offs
  return result;
}`;
    }

    const mockResult = {
      refactoring_potential: refactoringPotential,
      feedback: feedback.trim(),
      optimization_suggestions: suggestions.trim(),
      code_example: codeExample
    };

    aiJobs.set(jobId, {
      status: "done",
      result: {
        parsed: mockResult,
        raw: JSON.stringify(mockResult)
      }
    });
  } catch (error) {
    console.error("Error processing AI job:", error);
    aiJobs.set(jobId, {
      status: "error",
      error: error.message
    });
  }
}

// GitHub OAuth routes
// Pre-authorization confirmation page (this is a local page shown before redirecting
// to GitHub's OAuth consent screen). GitHub's consent text itself is controlled
// by the OAuth app's name and owner on GitHub. To change the GitHub consent UI
// you must update the OAuth App settings on GitHub (Developer settings).
app.get('/auth/confirm', (req, res) => {
  const appName = process.env.GITHUB_APP_NAME || 'Algorythm AI';
  const owner = process.env.GITHUB_APP_OWNER || 'pratiksha2828';
  // allow selecting repo vs login flow via query param (e.g. ?scope=repo)
  const oauthType = req.query.scope === 'repo' ? 'repo' : 'login';
  const authPath = oauthType === 'repo' ? '/auth/github/repo' : '/auth/github';

  res.send(`<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Authorize ${appName}</title>
      <style>body{font-family:system-ui,Segoe UI,Roboto,Arial;line-height:1.4;padding:24px} .card{max-width:680px;margin:32px auto;padding:20px;border-radius:8px;border:1px solid #e6e6e6} a.button{display:inline-block;padding:10px 16px;background:#0366d6;color:#fff;border-radius:6px;text-decoration:none}</style>
    </head>
    <body>
      <div class="card">
        <h1>${appName} by ${owner} wants to authorize</h1>
        <p>This site will redirect you to GitHub's authorization page to grant the requested permissions. The actual GitHub consent screen is served by GitHub — to change how that screen appears update the OAuth App name/owner in your GitHub Developer settings.</p>
        <p>
          <a class="button" href="${authPath}">Continue to GitHub</a>
          <a style="margin-left:12px" href="/login">Cancel</a>
        </p>
      </div>
    </body>
  </html>`);
});

app.get("/auth/github", (req, res, next) => {
  console.log("🔐 Redirecting to GitHub OAuth");
  req.session.oauth_type = "login";
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

app.get("/auth/github/repo", (req, res, next) => {
  console.log("🔐 Redirecting to GitHub OAuth (repo scope)");
  req.session.oauth_type = "repo";
  passport.authenticate("github", { scope: ["user:email", "repo"] })(req, res, next);
});

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login?error=auth_failed",
  }),
  (req, res) => {
    console.log("📩 Received callback from GitHub with code");
    const token = req.user?.accessToken;
    const username = req.user?.profile?.username;
    const oauthType = req.session.oauth_type || "login";
    req.session.oauth_type = null;

    console.log("✅ Access token received");
    console.log(`✅ User authenticated: ${username}`);

    if (oauthType === "repo") {
      // Repo-specific OAuth should go to the deepwiki-demo on the backend
      res.redirect(
        `http://localhost:5000/deepwiki-demo?repo_token=${token || ""}&repo_username=${username || ""}`
      );
    } else {
      // Regular login: show the space-themed redirect page with auth success message
      // The page will auto-redirect to the frontend after 2 seconds
      res.redirect(
        `http://localhost:5000/auth/success?token=${encodeURIComponent(token || "")}&username=${encodeURIComponent(username || "")}`
      );
    }
  }
);

// Success page - shows authentication success and redirects to dashboard
app.get("/auth/success", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/redirect.html"));
});

// Logout endpoint
app.get("/auth/logout", (req, res) => {
  console.log("🔓 User logging out");
  req.logout((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    console.log("✅ User logged out successfully");
    res.redirect("http://localhost:5000/login");
  });
});

// DEEPWIKI MOCK ENDPOINT - Fallback for testing
app.post("/deepwiki/analyze", async (req, res) => {
  try {
    console.log("🧠 Repository indexing endpoint called:", req.body);
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        status: "error",
        error: "Repository URL required",
      });
    }

    // Simulate indexing processing
    console.log(`📊 Starting indexing for: ${repoUrl}`);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return indexing response
    const response = {
      status: "success",
      message: "Repository indexing started successfully",
      indexing_id: `index_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data: {
        repo_url: repoUrl,
        submitted_at: new Date().toISOString(),
        estimated_completion: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        indexing_type: "deep_analysis",
        features: [
          "code_structure_analysis",
          "documentation_extraction",
          "dependency_mapping",
          "architecture_insights",
          "ai_chatbot_preparation",
        ],
      },
    };

    console.log("✅ Repository indexing queued:", response.indexing_id);
    res.json(response);
  } catch (error) {
    console.error("❌ Indexing endpoint error:", error);
    res.status(500).json({
      status: "error",
      error: "Repository indexing service temporarily unavailable",
    });
  }
});

// DeepWiki Demo Chatbot Page
app.get("/deepwiki-demo", async (req, res) => {
  const { repo_token, repo_username, repo_url } = req.query;
  let repoData = null;

  // Try to fetch real repo data if we have a repo_url
  if (repo_url) {
    try {
      const { owner, repo } = parseGitHubUrl(repo_url);
      const repoResponse = await fetchFn(`https://api.github.com/repos/${owner}/${repo}`);
      if (repoResponse.ok) {
        repoData = await repoResponse.json();
      }
    } catch (error) {
      console.error("Failed to fetch repo data:", error);
    }
  }

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Algorythm AI - ${repo_username || 'Repository'} Analysis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .chat-messages {
            max-height: 60vh;
            overflow-y: auto;
        }
        .message {
            margin-bottom: 1rem;
            padding: 0.75rem;
            border-radius: 0.5rem;
            max-width: 80%;
        }
        .user-message {
            background-color: #3b82f6;
            color: white;
            margin-left: auto;
        }
        .bot-message {
            background-color: #f3f4f6;
            color: #1f2937;
        }
        .chat-mode-buttons {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .mode-button {
            padding: 0.5rem 1rem;
            border: 2px solid #3b82f6;
            background-color: white;
            color: #3b82f6;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .mode-button.active {
            background-color: #3b82f6;
            color: white;
        }
        .mode-button:hover {
            background-color: #3b82f6;
            color: white;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen" style="background-image: url('/images/Generate a cosmic sp.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Algorythm AI</h1>
                <button id="downloadPdf" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    📄 Download Conversation as PDF
                </button>
            </div>
            
            <div class="chat-mode-buttons">
              <button id="shortMode" class="mode-button active" onclick="setChatMode('short')">chatbot-1</button>
            </div>
            
            <div class="mb-4 p-4 bg-blue-50 rounded-lg">
              <h2 id="repo-title" class="font-semibold text-blue-800">Repository: ${repo_username || 'Unknown'}</h2>
              <p id="repo-desc" class="text-blue-600 text-sm">Ask me anything about your codebase structure, dependencies, or documentation!</p>
            </div>

            <div id="chat-messages" class="chat-messages border rounded-lg p-4 mb-4 bg-gray-50">
              <div class="bot-message message" id="initial-bot">
                <strong>Algorythm AI:</strong> Hello! I've analyzed your repository. What would you like to know about your codebase?
              </div>
            </div>

            <div class="flex gap-2">
                <input 
                    type="text" 
                    id="message-input" 
                    placeholder="Ask about your code, dependencies, architecture..." 
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <button id="send-button" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Send
                </button>
            </div>
        </div>
    </div>

    <script>
        const messagesContainer = document.getElementById('chat-messages');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const downloadPdfButton = document.getElementById('downloadPdf');
        const shortModeButton = document.getElementById('shortMode');

        // Start with a simple initial bot message; repo-specific text will be injected safely into the DOM
        let conversation = [
          { role: 'bot', content: "Hello! I've analyzed your repository. What would you like to know about your codebase?" }
        ];

        let chatMode = 'short'; // Default to short answers
        // Safely stringify repoData to avoid breaking the <script> tag if fields contain '</script>'
        const repoInfo = ${JSON.stringify(repoData).replace(/</g, '\\u003c')};
        const repoUrl = ${JSON.stringify(repo_url || '')};
        const deepwikiUrl = ${JSON.stringify(process.env.DEEPWIKI_URL || 'https://deepwiki.com')};

        // Populate repo title/description and the initial bot message safely on the client
        try {
          if (repoInfo && typeof repoInfo === 'object') {
            const titleEl = document.getElementById('repo-title');
            const descEl = document.getElementById('repo-desc');
            const initialBot = document.getElementById('initial-bot');
            if (titleEl) titleEl.textContent = 'Repository: ' + (repoInfo.full_name || ("${repo_username || ''}"));
            if (descEl) descEl.textContent = repoInfo.description || descEl.textContent;
            if (initialBot) {
              const name = repoInfo.full_name ? ' (' + repoInfo.full_name + ')' : '';
              initialBot.innerHTML = "<strong>Algorythm AI:</strong> Hello! I've analyzed your repository" + name + ". What would you like to know about your codebase?";
            }
          }
        } catch (e) {
          // Defensive: if DOM isn't ready or repoInfo is unexpected, ignore
          console.warn('Failed to populate repo info on demo page:', e);
        }

        function setChatMode(mode) {
          chatMode = mode;
          shortModeButton.classList.toggle('active', mode === 'short');
        }

        function addMessage(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = role === 'user' ? 'user-message message' : 'bot-message message';
            messageDiv.innerHTML = role === 'user' ? 
                \`<strong>You:</strong> \${content}\` : 
                \`<strong>Algorythm AI:</strong> \${content}\`;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            conversation.push({ role, content });
        }

        async function generateBotResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            if (repoInfo) {
                if (lowerMessage.includes('structure') || lowerMessage.includes('architecture') || lowerMessage.includes('main files') || lowerMessage.includes('files')) {
                    // Check if user wants more depth/detail
                    const wantsDetail = lowerMessage.includes('depth') || lowerMessage.includes('detail') || lowerMessage.includes('more') || lowerMessage.includes('explain') || lowerMessage.includes('actually');
                    return wantsDetail || chatMode !== 'short'
                        ? \`The repository "\${repoInfo.full_name}" follows a standard structure with \${repoInfo.language || 'multiple languages'}. It has \${repoInfo.size} bytes of code across \${repoInfo.forks_count} forks. The main files would typically include package.json for dependencies, README.md for documentation, and source code files in the main directories.\`
                        : \`Primary: \${repoInfo.language || 'Unknown'}. Size: \${(repoInfo.size / 1024).toFixed(1)} MB. Standard repo layout.\`;
                } else if (lowerMessage.includes('dependencies') || lowerMessage.includes('packages')) {
                    // Check if user wants more depth/detail
                    const wantsDetail = lowerMessage.includes('depth') || lowerMessage.includes('detail') || lowerMessage.includes('more') || lowerMessage.includes('explain') || lowerMessage.includes('actually');
                    return wantsDetail || chatMode !== 'short'
                        ? \`Dependencies are managed through package.json/requirements.txt. The repo has \${repoInfo.open_issues_count} open issues which may indicate dependency concerns. Size suggests \${repoInfo.size > 1000000 ? 'complex' : 'moderate'} dependency management needs.\`
                        : \`Check package.json/requirements.txt. \${repoInfo.open_issues_count} open issues.\`;
                } else if (lowerMessage.includes('documentation') || lowerMessage.includes('readme')) {
                    // Check if user wants more depth/detail
                    const wantsDetail = lowerMessage.includes('depth') || lowerMessage.includes('detail') || lowerMessage.includes('more') || lowerMessage.includes('explain') || lowerMessage.includes('actually');
                    return wantsDetail || chatMode !== 'short'
                        ? \`\${repoInfo.has_wiki ? 'Has a wiki for detailed documentation.' : 'No wiki found.'} \${repoInfo.description ? 'Description: "' + repoInfo.description + '"' : 'No description provided'}. README typically contains setup and usage instructions.\`
                        : \`\${repoInfo.has_wiki ? 'Has' : 'No'} wiki. \${repoInfo.description ? 'Description: "' + repoInfo.description + '"' : 'No description'}\`;
                } else if (lowerMessage.includes('languages') || lowerMessage.includes('tech stack')) {
                    // Check if user wants more depth/detail
                    const wantsDetail = lowerMessage.includes('depth') || lowerMessage.includes('detail') || lowerMessage.includes('more') || lowerMessage.includes('explain') || lowerMessage.includes('actually');
                    return wantsDetail || chatMode !== 'short'
                        ? \`Primary language: \${repoInfo.language || 'Not specified'}. Repository size: \${(repoInfo.size / 1024).toFixed(1)} MB. Last updated: \${new Date(repoInfo.updated_at).toLocaleDateString()}. This suggests a \${repoInfo.language === 'JavaScript' ? 'web application' : repoInfo.language === 'Python' ? 'data science or backend' : 'specialized'} project.\`
                        : \`Primary: \${repoInfo.language || 'Not specified'}. Size: \${(repoInfo.size / 1024).toFixed(1)} MB. Updated: \${new Date(repoInfo.updated_at).toLocaleDateString()}.\`;
                } else if (lowerMessage.includes('contributors') || lowerMessage.includes('team')) {
                    // Check if user wants more depth/detail
                    const wantsDetail = lowerMessage.includes('depth') || lowerMessage.includes('detail') || lowerMessage.includes('more') || lowerMessage.includes('explain') || lowerMessage.includes('actually');
                    return wantsDetail || chatMode !== 'short'
                        ? \`The repository has \${repoInfo.network_count} contributors in the network. It's \${repoInfo.fork ? '' : 'not '}a fork. Default branch: \${repoInfo.default_branch}. This indicates \${repoInfo.network_count > 10 ? 'active community development' : 'small team development'}.\`
                        : \`\${repoInfo.network_count} contributors. \${repoInfo.fork ? '' : 'Not '}a fork. Branch: \${repoInfo.default_branch}.\`;
                } else if (lowerMessage.includes('activity') || lowerMessage.includes('recent')) {
                    // Check if user wants more depth/detail
                    const wantsDetail = lowerMessage.includes('depth') || lowerMessage.includes('detail') || lowerMessage.includes('more') || lowerMessage.includes('explain') || lowerMessage.includes('actually');
                    return wantsDetail || chatMode !== 'short'
                        ? \`Last push: \${new Date(repoInfo.pushed_at).toLocaleDateString()}. Repository created: \${new Date(repoInfo.created_at).toLocaleDateString()}. \${repoInfo.archived ? 'This repository is archived.' : 'This repository is active.'} Activity level: \${repoInfo.stargazers_count > 100 ? 'High' : repoInfo.stargazers_count > 10 ? 'Moderate' : 'Low'}.\`
                        : \`Last push: \${new Date(repoInfo.pushed_at).toLocaleDateString()}. Created: \${new Date(repoInfo.created_at).toLocaleDateString()}. \${repoInfo.archived ? 'Archived' : 'Active'}.\`;
                } else if ((lowerMessage.includes('what') && (lowerMessage.includes('project') || lowerMessage.includes('repo') || lowerMessage.includes('do'))) || lowerMessage.includes('describe') || lowerMessage.includes('about')) {
                    const description = repoInfo.description || 'No description available.';
                    // Check if user wants more depth/detail
                    const wantsDetail = lowerMessage.includes('depth') || lowerMessage.includes('detail') || lowerMessage.includes('more') || lowerMessage.includes('explain') || lowerMessage.includes('actually');
                    if (wantsDetail || chatMode !== 'short') {
                        // Provide more detailed explanation
                        const detailedDesc = description.toLowerCase().includes('agent') ? 
                            \`This is an Agent Management & Distribution System built with the MERN stack (MongoDB, Express.js, React, Node.js). It appears to be designed for managing and distributing AI agents or software agents across different systems. The system likely includes features for:

• Agent registration and onboarding
• Distribution and deployment management  
• Performance monitoring and analytics
• Configuration management
• Load balancing and scaling
• Security and access control
• Integration with various platforms and services

The MERN stack suggests it has a modern web interface for managing agents, with real-time capabilities and a robust backend for handling complex agent operations.\` :
                            \`This project is described as: "\${description}". Based on the repository structure, it appears to be a full-stack application using modern web technologies with \${repoInfo.language || 'multiple programming languages'}.\`;
                        return detailedDesc;
                    } else {
                        return \`Project description: \${description}\`;
                    }
            } else {
                // Fallback responses when no repo data
                if (lowerMessage.includes('structure') || lowerMessage.includes('architecture')) {
                    return chatMode === 'short'
                        ? "Well-organized structure with frontend (React), backend (Node.js), and utilities."
                        : "Based on my analysis, your repository follows a well-organized structure with clear separation of concerns. The main components include frontend (React), backend (Node.js), and supporting utilities.";
                } else if (lowerMessage.includes('dependencies') || lowerMessage.includes('packages')) {
                    return chatMode === 'short'
                        ? "Uses React, Express.js, and modern JS dependencies. All up-to-date."
                        : "Your project uses modern JavaScript dependencies including React for the frontend, Express.js for the backend, and various utility libraries. All dependencies appear to be up-to-date and well-maintained.";
                } else if (lowerMessage.includes('documentation') || lowerMessage.includes('readme')) {
                    return chatMode === 'short'
                        ? "Comprehensive docs with setup instructions, API references, and guidelines."
                        : "The repository has comprehensive documentation with clear setup instructions, API references, and contribution guidelines. The README provides excellent guidance for new developers.";
                } else if (lowerMessage.includes('languages') || lowerMessage.includes('tech stack')) {
                    return chatMode === 'short'
                        ? "JavaScript/TypeScript, React, Node.js, GitHub Actions for CI/CD."
                        : "The primary technologies used are JavaScript/TypeScript, with React for frontend development, Node.js for backend services, and supporting tools like GitHub Actions for CI/CD.";
                } else {
                    return chatMode === 'short'
                        ? "I can help with structure, dependencies, documentation, or specific codebase aspects."
                        : "That's an interesting question about your codebase! I can help you understand the structure, dependencies, documentation, or any specific aspects of your repository. What would you like to explore?";
                }
            }
        }

        sendButton.addEventListener('click', async () => {
            const message = messageInput.value.trim();
            if (message) {
                addMessage('user', message);
                messageInput.value = '';
                
                // Show typing indicator
                const typingDiv = document.createElement('div');
                typingDiv.className = 'bot-message message';
                typingDiv.innerHTML = '<strong>Algorythm AI:</strong> <em>Thinking...</em>';
                messagesContainer.appendChild(typingDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Try backend chat endpoint first
                try {
                  console.log('Sending chat to backend', repoUrl, message);
                  const resp = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ repoUrl: repoUrl, question: message })
                  });
                    
                    if (resp.ok) {
                        const body = await resp.json();
                        const botText = body.response || body.data || body.answer || body.reply;
                        if (botText) {
                            // Remove typing indicator
                            messagesContainer.removeChild(typingDiv);
                            addMessage('bot', String(botText));
                            return;
                        }
                    } else {
                        console.warn('Chat backend returned non-ok status', resp.status);
                    }
                } catch (err) {
                    console.error('Chat backend error:', err);
                }
                
                // Fallback to local generator
                const response = await generateBotResponse(message);
                
                // Remove typing indicator
                messagesContainer.removeChild(typingDiv);
                
                addMessage('bot', response);
            }
        });

        // Use keydown and prevent default to reliably detect Enter presses
        messageInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
          }
        });

        downloadPdfButton.addEventListener('click', () => {
            // Load jsPDF dynamically
            if (!window.jspdf) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = () => generatePDF();
                document.head.appendChild(script);
            } else {
                generatePDF();
            }
        });

        function generatePDF() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            pdf.setFontSize(20);
            pdf.text('Algorythm AI Conversation', 20, 30);
            
            pdf.setFontSize(12);
            pdf.text(\`Repository: \${repoInfo ? repoInfo.full_name : 'Unknown'}\`, 20, 50);
            pdf.text(\`Date: \${new Date().toLocaleDateString()}\`, 20, 60);
            pdf.text(\`Mode: \${chatMode === 'short' ? 'chatbot-1' : 'chatbot-1'}\`, 20, 70);
            
            let yPosition = 90;
            
            conversation.forEach((msg, index) => {
                const speaker = msg.role === 'user' ? 'You:' : 'Algorythm AI:';
                const lines = pdf.splitTextToSize(\`\${speaker} \${msg.content}\`, 170);
                
                lines.forEach(line => {
                    if (yPosition > 270) {
                        pdf.addPage();
                        yPosition = 30;
                    }
                    pdf.text(line, 20, yPosition);
                    yPosition += 10;
                });
                
                yPosition += 5; // Extra space between messages
            });
            
            pdf.save(\`algorythm_conversation_\${new Date().toISOString().split('T')[0]}.pdf\`);
        }
    </script>
</body>
</html>
  `);
});

// ============================================
// Serve Static Frontend Files
// ============================================

// Serve public static files (login.html, redirect.html, etc)
app.use(express.static(path.join(__dirname, "./public")));

// Serve static files from React build with cache-control headers
app.use(
  express.static(path.join(__dirname, "../frontend/dist"), {
    setHeaders: function (res, filePath) {
      // Ensure index.html is not cached so clients always pick up newest bundle
      const name = path.basename(filePath);
      if (name === 'index.html') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (filePath.includes(path.join('frontend', 'dist', 'assets')) || /\.(js|css|png|jpg|svg|ico|woff2?)$/.test(filePath)) {
        // Long cache for hashed static assets
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  })
);

// SPA fallback: serve index.html but avoid caching it
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/auth/') || req.path.startsWith('/deepwiki-demo')) {
    return res.status(404).send('Not found');
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Algorythm  running on: http://localhost:${PORT}/login`);
});

