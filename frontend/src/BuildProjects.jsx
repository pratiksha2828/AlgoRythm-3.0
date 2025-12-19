import './app.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

export default function BuildProjects() {
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);
  const [projectProgress, setProjectProgress] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  
  // States for user data storage (exactly like streaks.jsx)
  const [projectProgressId, setProjectProgressId] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const API_BASE =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE) ||
    'http://localhost:5000';

  // Project categories and difficulty levels
  const projectCategories = [
    'All', 'Web Development', 'Mobile Apps', 'Games', 'Data Science', 'APIs', 'Automation'
  ];

  const difficultyLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Fetch project progress (exactly like streaks.jsx)
  const fetchProjectProgress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/project-progress/me`, {
        credentials: 'include'
      });

      const ct = response.headers.get('content-type') || '';
      if (ct.includes('text/html')) throw new Error('Not authenticated.');

      if (!response.ok) throw new Error('Failed to fetch project progress');
      const data = await response.json();

      setProjectProgressId(data.projectProgressId || null);
      setUsername(data.username || null);
      
      // Convert the backend progress data to frontend format
      if (data.progress && data.progress.projects) {
        const progressMap = {};
        data.progress.projects.forEach(project => {
          progressMap[project.projectId] = {
            currentStep: project.currentStep,
            completedSteps: project.completedSteps || []
          };
        });
        setProjectProgress(progressMap);
      }
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProjectProgress();
  }, [fetchProjectProgress]);

  // Snackbar helper (exactly like streaks.jsx)
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  // Start building project with database save
  const startBuilding = async (project) => {
    try {
      if (!projectProgressId) {
        throw new Error('User ID unknown. Please login again.');
      }

      setActiveProject(project);
      setCurrentStep(0);
      
      // Initialize progress in state
      if (!projectProgress[project.id]) {
        const newProgress = {
          ...projectProgress,
          [project.id]: { currentStep: 0, completedSteps: [] }
        };
        setProjectProgress(newProgress);
      }

      // Save to database (exactly like streaks.jsx)
      setUpdating(true);
      const response = await fetch(
        `${API_BASE}/api/project-progress/${encodeURIComponent(projectProgressId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ 
            projectId: project.id.toString(),
            projectTitle: project.title,
            currentStep: 0,
            completedSteps: [],
            completed: false
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update project progress:', response.status, errorText);
        throw new Error(`Failed to update project progress (${response.status})`);
      }

      const data = await response.json();
      if (data.success) {
        showSnackbar(`🚀 Started building: ${project.title}`);
      }
    } catch (error) {
      console.error('Failed to start project:', error);
      showSnackbar(error.message || 'Failed to start project', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Complete step with database save
  const completeStep = async (stepIndex) => {
    if (activeProject && projectProgressId) {
      try {
        setUpdating(true);
        
        const updatedProgress = {
          ...projectProgress,
          [activeProject.id]: {
            ...projectProgress[activeProject.id],
            completedSteps: [...(projectProgress[activeProject.id]?.completedSteps || []), stepIndex]
          }
        };
        
        setProjectProgress(updatedProgress);

        // Save to database
        const response = await fetch(
          `${API_BASE}/api/project-progress/${encodeURIComponent(projectProgressId)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
              projectId: activeProject.id.toString(),
              projectTitle: activeProject.title,
              currentStep: currentStep,
              completedSteps: updatedProgress[activeProject.id].completedSteps,
              completed: false
            })
          }
        );

        if (!response.ok) throw new Error('Failed to save progress');
        
        showSnackbar(`✅ Step ${stepIndex + 1} completed!`);
      } catch (error) {
        console.error('Failed to save step progress:', error);
        showSnackbar('Failed to save progress', 'error');
      } finally {
        setUpdating(false);
      }
    }
  };

  // Complete project with database save
  const completeProject = async () => {
    if (activeProject && projectProgressId) {
      try {
        setUpdating(true);
        
        const response = await fetch(
          `${API_BASE}/api/project-progress/${encodeURIComponent(projectProgressId)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
              projectId: activeProject.id.toString(),
              projectTitle: activeProject.title,
              currentStep: currentStep,
              completedSteps: [...Array(activeProject.steps.length).keys()],
              completed: true
            })
          }
        );

        if (!response.ok) throw new Error('Failed to complete project');
        
        showSnackbar(`🎉 Congratulations! You completed ${activeProject.title}!`);
        setActiveProject(null);
      } catch (error) {
        console.error('Failed to complete project:', error);
        showSnackbar('Failed to complete project', 'error');
      } finally {
        setUpdating(false);
      }
    }
  };

  // Copy starter code function
  const copyStarterCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      showSnackbar('Starter code copied to clipboard!');
    });
  };

  // Projects data (your existing projects array)
  const projects = [
    // 🌐 WEB DEVELOPMENT
    {
      id: 1,
      title: "Personal Portfolio Website",
      description: "Build a responsive portfolio to showcase your skills and projects.",
      level: "Beginner",
      category: "Web Development",
      duration: "3-5 days",
      technologies: ["HTML", "CSS", "JavaScript"],
      features: ["Responsive Design", "Navigation Menu", "Project Gallery"],
      resources: [
        { name: "Responsive Design Basics", link: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design" },
        { name: "Flexbox Guide", link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
        { name: "CSS Transitions", link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions" }
      ],
      tutorialLink: "https://www.youtube.com/watch?v=27JtRAI3QO8",
      starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header><h1>Hi, I'm Your Name</h1></header>
  <section id="projects"><h2>Projects</h2></section>
  <footer><p>© 2025 Your Name</p></footer>
</body>
</html>`,
      icon: "🌐",
      steps: [
        "Set up sections: About, Projects, Contact",
        "Add responsive layout",
        "Style with CSS animations"
      ]
    },

    // ... (include all your other projects here - I've shortened for brevity)
    {
      id: 2,
      title: "Weather App",
      description: "Create a weather forecast web app using OpenWeatherMap API.",
      level: "Beginner",
      category: "Web Development",
      duration: "4-6 days",
      technologies: ["HTML", "CSS", "JavaScript", "API"],
      features: ["Search by City", "Temperature Display", "Weather Icons"],
      resources: [
        { name: "Fetch API Docs", link: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" },
        { name: "OpenWeatherMap API", link: "https://openweathermap.org/api" },
        { name: "Async JS Basics", link: "https://javascript.info/async" }
      ],
      tutorialLink: "https://www.youtube.com/watch?v=WZNG8UomjSI",
      starterCode: `<!DOCTYPE html>
<html>
<head><title>Weather App</title></head>
<body>
  <input id="city" placeholder="Enter city">
  <button onclick="getWeather()">Search</button>
  <div id="result"></div>
  <script>
    async function getWeather(){
      const city = document.getElementById('city').value;
      const res = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=YOUR_KEY&units=metric\`);
      const data = await res.json();
      document.getElementById('result').innerText = data.main.temp + '°C';
    }
  </script>
</body>
</html>`,
      icon: "🌦️",
      steps: [
        "Fetch data using API",
        "Parse JSON response",
        "Display results dynamically"
      ]
    },
    // Add all your other projects here...
    {
    id: 3,
    title: "Blog CMS",
    description: "Develop a simple content management system for blogs.",
    level: "Intermediate",
    category: "Web Development",
    duration: "1-2 weeks",
    technologies: ["React", "Node.js", "MongoDB"],
    features: ["User Auth", "CRUD Posts", "Rich Text Editor"],
    resources: [
      { name: "Express.js Docs", link: "https://expressjs.com/" },
      { name: "MongoDB CRUD Guide", link: "https://www.mongodb.com/docs/manual/crud/" },
      { name: "React Router", link: "https://reactrouter.com/en/main/start/overview" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=1NrHkjlWVhM",
    starterCode: `// server.js
import express from "express";
const app = express();
app.get("/", (req,res)=>res.send("Blog CMS Backend"));
app.listen(5000,()=>console.log("Server running"));`,
    icon: "📝",
    steps: [
      "Set up backend with Express",
      "Create post routes",
      "Connect frontend using React"
    ]
  },
  {
    id: 4,
    title: "E-Commerce Platform",
    description: "Build a complete e-commerce web app with cart and payments.",
    level: "Advanced",
    category: "Web Development",
    duration: "3-4 weeks",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    features: ["Cart System", "Product Filters", "Stripe Payments"],
    resources: [
      { name: "Stripe Docs", link: "https://stripe.com/docs/development" },
      { name: "MERN Stack Setup", link: "https://www.mongodb.com/languages/mern-stack-tutorial" },
      { name: "JWT Auth Guide", link: "https://jwt.io/introduction" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=tEMrD9t85v4",
    starterCode: `// client/src/App.js
import React from "react";
function App() {
  return <h1>🛒 E-Commerce Store</h1>;
}
export default App;`,
    icon: "🛒",
    steps: [
      "Create backend API routes",
      "Build product and cart pages",
      "Add payments and order history"
    ]
  },

  // 📱 MOBILE APPS
  {
    id: 5,
    title: "To-Do List App",
    description: "Create a simple mobile to-do app to track daily tasks.",
    level: "Beginner",
    category: "Mobile Apps",
    duration: "3-5 days",
    technologies: ["React Native"],
    features: ["Add/Delete Tasks", "Mark Complete", "Persistent Storage"],
    resources: [
      { name: "React Native Docs", link: "https://reactnative.dev/docs/getting-started" },
      { name: "AsyncStorage", link: "https://react-native-async-storage.github.io/async-storage/" },
      { name: "React Hooks", link: "https://react.dev/reference/react" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=0kL6nhutjQ8",
    starterCode: `import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  return (
    <View style={{ padding: 30 }}>
      <TextInput placeholder='New Task' onChangeText={setTask} value={task}/>
      <Button title='Add' onPress={()=>setTasks([...tasks, task])}/>
      {tasks.map((t,i)=><Text key={i}>{t}</Text>)}
    </View>
  );
}`,
    icon: "✅",
    steps: [
      "Create task list component",
      "Handle add/delete tasks",
      "Save tasks locally"
    ]
  },
  {
    id: 6,
    title: "BMI Calculator App",
    description: "A mobile app to calculate Body Mass Index from user input.",
    level: "Beginner",
    category: "Mobile Apps",
    duration: "3-4 days",
    technologies: ["Flutter", "Dart"],
    features: ["Input Validation", "BMI Formula", "Result Display"],
    resources: [
      { name: "Flutter Docs", link: "https://docs.flutter.dev/get-started" },
      { name: "Stateful Widgets", link: "https://docs.flutter.dev/development/ui/interactive" },
      { name: "Input Widgets", link: "https://api.flutter.dev/flutter/material/TextField-class.html" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=OwFMEhZbe_4",
    starterCode: `import 'package:flutter/material.dart';
void main()=>runApp(MaterialApp(home:BMI()));
class BMI extends StatefulWidget{ @override _BMIState createState()=>_BMIState();}
class _BMIState extends State<BMI>{
 double h=0,w=0;
 @override Widget build(context)=>Scaffold(body:Center(child:Text('BMI Calculator')));
}`,
    icon: "📱",
    steps: [
      "Create input fields",
      "Apply BMI formula",
      "Show categorized result"
    ]
  },
  {
    id: 7,
    title: "Expense Tracker",
    description: "Track your expenses with charts and categories.",
    level: "Intermediate",
    category: "Mobile Apps",
    duration: "1-2 weeks",
    technologies: ["React Native", "SQLite"],
    features: ["Charts", "Filters", "Storage"],
    resources: [
      { name: "SQLite Docs", link: "https://reactnative.dev/docs/sqlite" },
      { name: "Victory Charts", link: "https://formidable.com/open-source/victory/docs/native/" },
      { name: "React Navigation", link: "https://reactnavigation.org/docs/getting-started" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=PQnbtnsYUho",
    starterCode: `import React from 'react';
import { View, Text } from 'react-native';
export default function App(){ return <View><Text>Expense Tracker</Text></View> }`,
    icon: "💰",
    steps: [
      "Setup database",
      "Display expenses",
      "Visualize data with charts"
    ]
  },
  {
    id: 8,
    title: "Chat App",
    description: "A real-time chat application using Firebase backend.",
    level: "Advanced",
    category: "Mobile Apps",
    duration: "2-3 weeks",
    technologies: ["React Native", "Firebase"],
    features: ["Authentication", "Media Messages", "Realtime Sync"],
    resources: [
      { name: "Firebase Auth Docs", link: "https://firebase.google.com/docs/auth" },
      { name: "Firestore Docs", link: "https://firebase.google.com/docs/firestore" },
      { name: "Expo Setup", link: "https://docs.expo.dev/" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=ZKEqqIO7n-k",
    starterCode: `import React from 'react';
import { View, Text } from 'react-native';
export default function App(){ return <View><Text>Chat App</Text></View> }`,
    icon: "💬",
    steps: [
      "Connect Firebase",
      "Build chat UI",
      "Enable media upload"
    ]
  },

  // 🎮 GAMES
  {
    id: 9,
    title: "Memory Card Game",
    description: "Develop a browser-based memory card matching game.",
    level: "Beginner",
    category: "Games",
    duration: "3-5 days",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: ["Card Flipping", "Score", "Restart"],
    resources: [
      { name: "MDN Game Guide", link: "https://developer.mozilla.org/en-US/docs/Games" },
      { name: "CSS Grid Guide", link: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
      { name: "JS Array Methods", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=9SBafLiMLpc",
    starterCode: `<!DOCTYPE html><html><body><h1>Memory Game</h1><script>console.log('Game start');</script></body></html>`,
    icon: "🎮",
    steps: [
      "Create cards grid",
      "Flip cards and match pairs",
      "Track moves and score"
    ]
  },
  {
    id: 10,
    title: "Tic Tac Toe Game",
    description: "Classic 3x3 Tic Tac Toe for two players.",
    level: "Beginner",
    category: "Games",
    duration: "2-4 days",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: ["Win Logic", "Draw Detection", "Restart Option"],
    resources: [
      { name: "DOM Manipulation", link: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" },
      { name: "JavaScript Events", link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events" },
      { name: "CSS Grid", link: "https://css-tricks.com/snippets/css/complete-guide-grid/" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=Y-GkMjUZsmM",
    starterCode: `<!DOCTYPE html><html><body><div id='board'></div><script>console.log('Tic Tac Toe');</script></body></html>`,
    icon: "❌",
    steps: [
      "Create grid cells",
      "Add turn-based logic",
      "Display winner"
    ]
  },
  {
    id: 11,
    title: "Platformer Game",
    description: "Develop a 2D platformer game using Phaser.js.",
    level: "Intermediate",
    category: "Games",
    duration: "2-3 weeks",
    technologies: ["Phaser.js"],
    features: ["Physics", "Obstacles", "Scoring"],
    resources: [
      { name: "Phaser Docs", link: "https://phaser.io/tutorials/getting-started-phaser3" },
      { name: "Game Loop Basics", link: "https://developer.mozilla.org/en-US/docs/Games/Anatomy" },
      { name: "Canvas Tutorial", link: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=frRWKxB9Hm0",
    starterCode: `<!DOCTYPE html><script src='https://cdn.jsdelivr.net/npm/phaser@3'></script><script>new Phaser.Game({type:Phaser.AUTO,width:800,height:600,scene:{create(){this.add.text(200,200,'Platformer');}}});</script>`,
    icon: "🏃",
    steps: [
      "Initialize Phaser",
      "Add player controls",
      "Implement scoring"
    ]
  },
  {
    id: 12,
    title: "Multiplayer Game",
    description: "Real-time multiplayer game using Socket.io.",
    level: "Advanced",
    category: "Games",
    duration: "3-4 weeks",
    technologies: ["Node.js", "Socket.io", "HTML5 Canvas"],
    features: ["Realtime Sync", "Player States", "Leaderboard"],
    resources: [
      { name: "Socket.io Docs", link: "https://socket.io/docs/v4/" },
      { name: "Canvas API", link: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" },
      { name: "Express.js", link: "https://expressjs.com/" }
    ],
    tutorialLink: "https://www.youtube.com/watch?v=ppcBIHv_ZPs",
    starterCode: `// server.js
import express from 'express';
import { Server } from 'socket.io';
const app = express();
const server = app.listen(3000);
const io = new Server(server);
io.on('connection', s => console.log('player joined'));`,
    icon: "🕹️",
    steps: [
      "Setup socket server",
      "Sync player movements",
      "Render canvas updates"
    ]
  },
  // 📊 DATA SCIENCE
{
  id: 13,
  title: "Data Visualization Dashboard",
  description: "Create a simple dashboard using Python and Matplotlib.",
  level: "Beginner",
  category: "Data Science",
  duration: "4-6 days",
  technologies: ["Python", "Matplotlib", "Pandas"],
  features: ["Bar Chart", "Line Chart", "CSV Input"],
  resources: [
    { name: "Pandas Tutorial", link: "https://pandas.pydata.org/docs/getting_started/index.html" },
    { name: "Matplotlib Docs", link: "https://matplotlib.org/stable/tutorials/index.html" },
    { name: "Data Visualization Basics", link: "https://realpython.com/python-matplotlib-guide/" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=DAQNHzOcO5A",
  starterCode: `import pandas as pd
import matplotlib.pyplot as plt

data = {'Year': [2021, 2022, 2023], 'Sales': [100, 150, 200]}
df = pd.DataFrame(data)
plt.plot(df['Year'], df['Sales'])
plt.title('Sales Growth')
plt.show()`,
  icon: "📊",
  steps: [
    "Load data using Pandas",
    "Visualize with Matplotlib",
    "Add multiple chart types"
  ]
},
{
  id: 14,
  title: "Simple Linear Regression",
  description: "Implement linear regression to predict outcomes.",
  level: "Beginner",
  category: "Data Science",
  duration: "3-5 days",
  technologies: ["Python", "Scikit-learn"],
  features: ["Train/Test Split", "Regression Line", "Prediction"],
  resources: [
    { name: "Scikit-learn Docs", link: "https://scikit-learn.org/stable/" },
    { name: "NumPy Basics", link: "https://numpy.org/learn/" },
    { name: "Machine Learning Intro", link: "https://developers.google.com/machine-learning/crash-course" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=ZkjP5RJLQF4",
  starterCode: `from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1],[2],[3]])
y = np.array([2,4,6])

model = LinearRegression().fit(X, y)
print("Prediction for 4:", model.predict([[4]]))`,
  icon: "📈",
  steps: [
    "Prepare dataset",
    "Train model",
    "Test and visualize predictions"
  ]
},
{
  id: 15,
  title: "Customer Segmentation with K-Means",
  description: "Use K-Means clustering to segment customers.",
  level: "Intermediate",
  category: "Data Science",
  duration: "1-2 weeks",
  technologies: ["Python", "Scikit-learn", "Seaborn"],
  features: ["Data Scaling", "Cluster Visualization", "Centroid Calculation"],
  resources: [
    { name: "K-Means Guide", link: "https://scikit-learn.org/stable/modules/clustering.html#k-means" },
    { name: "Data Normalization", link: "https://scikit-learn.org/stable/modules/preprocessing.html" },
    { name: "Seaborn Docs", link: "https://seaborn.pydata.org/tutorial.html" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=4b5d3muPQmA",
  starterCode: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd

df = pd.DataFrame({'Age':[25,30,45,35],'Income':[30,60,100,70]})
scaled = StandardScaler().fit_transform(df)
model = KMeans(n_clusters=2).fit(scaled)
print(model.labels_)`,
  icon: "🧠",
  steps: [
    "Load dataset",
    "Normalize features",
    "Run K-Means and visualize clusters"
  ]
},
{
  id: 16,
  title: "Deep Learning Image Classifier",
  description: "Build a CNN to classify images using TensorFlow.",
  level: "Advanced",
  category: "Data Science",
  duration: "3-4 weeks",
  technologies: ["Python", "TensorFlow", "Keras"],
  features: ["Image Preprocessing", "CNN Layers", "Model Evaluation"],
  resources: [
    { name: "TensorFlow Guide", link: "https://www.tensorflow.org/tutorials" },
    { name: "Keras API", link: "https://keras.io/api/" },
    { name: "Image Classification Tutorial", link: "https://www.tensorflow.org/tutorials/images/classification" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=WFr2WgN9_xE",
  starterCode: `import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
  layers.Conv2D(32,(3,3),activation='relu',input_shape=(64,64,3)),
  layers.MaxPooling2D(2,2),
  layers.Flatten(),
  layers.Dense(64,activation='relu'),
  layers.Dense(2,activation='softmax')
])
model.summary()`,
  icon: "🤖",
  steps: [
    "Load dataset",
    "Define CNN layers",
    "Train and test accuracy"
  ]
},

// 🔗 APIs
{
  id: 17,
  title: "REST API with Flask",
  description: "Create a REST API for managing users and data.",
  level: "Beginner",
  category: "APIs",
  duration: "4-6 days",
  technologies: ["Python", "Flask"],
  features: ["GET/POST Routes", "JSON Responses", "Error Handling"],
  resources: [
    { name: "Flask Quickstart", link: "https://flask.palletsprojects.com/en/latest/quickstart/" },
    { name: "REST API Design", link: "https://restfulapi.net/" },
    { name: "Postman API Testing", link: "https://learning.postman.com/docs/getting-started/introduction/" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=GMppyAPbLYk",
  starterCode: `from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api')
def home():
    return jsonify({'message': 'Hello API'})

app.run(debug=True)`,
  icon: "🌐",
  steps: [
    "Set up Flask app",
    "Add GET/POST endpoints",
    "Return JSON data"
  ]
},
{
  id: 18,
  title: "GitHub Repo Fetcher",
  description: "Fetch GitHub repositories using their public API.",
  level: "Beginner",
  category: "APIs",
  duration: "3-5 days",
  technologies: ["HTML", "CSS", "JavaScript"],
  features: ["API Fetch", "Dynamic DOM Update", "Error Handling"],
  resources: [
    { name: "GitHub API Docs", link: "https://docs.github.com/en/rest" },
    { name: "Async Await", link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous" },
    { name: "Fetch API Guide", link: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=5QlE6o-iYcE",
  starterCode: `<!DOCTYPE html><html><body>
<input id='user' placeholder='GitHub username'>
<button onclick='getRepos()'>Get Repos</button>
<ul id='repos'></ul>
<script>
async function getRepos(){
  const u=document.getElementById('user').value;
  const r=await fetch(\`https://api.github.com/users/\${u}/repos\`);
  const data=await r.json();
  document.getElementById('repos').innerHTML=data.map(d=>'<li>'+d.name+'</li>').join('');
}
</script></body></html>`,
  icon: "🐙",
  steps: [
    "Fetch data from GitHub API",
    "Display repo list",
    "Add error messages"
  ]
},
{
  id: 19,
  title: "Movie Recommendation API",
  description: "Build a recommendation API using FastAPI.",
  level: "Intermediate",
  category: "APIs",
  duration: "1-2 weeks",
  technologies: ["Python", "FastAPI"],
  features: ["JSON Responses", "Recommendation Logic", "Filtering"],
  resources: [
    { name: "FastAPI Docs", link: "https://fastapi.tiangolo.com/" },
    { name: "Pydantic Models", link: "https://docs.pydantic.dev/" },
    { name: "REST Design Guide", link: "https://restfulapi.net/" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=0sOvCWFmrtA",
  starterCode: `from fastapi import FastAPI
app = FastAPI()

@app.get('/recommend/{genre}')
def rec(genre: str):
    movies = {'action': ['Avengers','Mad Max'], 'drama': ['Titanic','Joker']}
    return {"recommendations": movies.get(genre.lower(), [])}`,
  icon: "🎬",
  steps: [
    "Set up FastAPI project",
    "Define endpoints",
    "Add logic for recommendations"
  ]
},
{
  id: 20,
  title: "GraphQL API Server",
  description: "Create a GraphQL API using Node.js and Apollo Server.",
  level: "Advanced",
  category: "APIs",
  duration: "2-3 weeks",
  technologies: ["Node.js", "GraphQL", "Apollo Server"],
  features: ["Queries", "Mutations", "Resolvers"],
  resources: [
    { name: "Apollo GraphQL Docs", link: "https://www.apollographql.com/docs/apollo-server/" },
    { name: "GraphQL.org Guide", link: "https://graphql.org/learn/" },
    { name: "Node.js Docs", link: "https://nodejs.org/en/docs" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=ZQL7tL2S0oQ",
  starterCode: `import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql\`
  type Query { hello: String }
\`;
const resolvers = { Query: { hello: () => 'Hello GraphQL!' } };

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(()=>console.log('Server running...'));`,
  icon: "🔺",
  steps: [
    "Define schema",
    "Write resolvers",
    "Test with Apollo Studio"
  ]
},

// ⚙️ AUTOMATION
{
  id: 21,
  title: "File Organizer Script",
  description: "Automatically sort files in folders by extension.",
  level: "Beginner",
  category: "Automation",
  duration: "2-3 days",
  technologies: ["Python", "OS"],
  features: ["File Scanning", "Sorting", "Folder Creation"],
  resources: [
    { name: "Python os Module", link: "https://docs.python.org/3/library/os.html" },
    { name: "File Handling in Python", link: "https://realpython.com/working-with-files-in-python/" },
    { name: "Pathlib Library", link: "https://docs.python.org/3/library/pathlib.html" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=STPgd4BT9lU",
  starterCode: `import os, shutil

path = './downloads'
for file in os.listdir(path):
  ext = file.split('.')[-1]
  dest = os.path.join(path, ext)
  os.makedirs(dest, exist_ok=True)
  shutil.move(os.path.join(path,file), dest)`,
  icon: "🗂️",
  steps: [
    "Read directory contents",
    "Detect file types",
    "Move into categorized folders"
  ]
},
{
  id: 22,
  title: "Auto Email Sender",
  description: "Send bulk personalized emails automatically.",
  level: "Beginner",
  category: "Automation",
  duration: "3-4 days",
  technologies: ["Python", "smtplib"],
  features: ["Bulk Emails", "Custom Message", "CSV Input"],
  resources: [
    { name: "smtplib Docs", link: "https://docs.python.org/3/library/smtplib.html" },
    { name: "Email Handling", link: "https://realpython.com/python-send-email/" },
    { name: "CSV Module", link: "https://docs.python.org/3/library/csv.html" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=JRCJ6RtE3xU",
  starterCode: `import smtplib, csv
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('you@gmail.com','password')
with open('contacts.csv') as f:
  for name,email in csv.reader(f):
    server.sendmail('you@gmail.com', email, f"Subject: Hello {name}\\nHi there!")`,
  icon: "📧",
  steps: [
    "Read contacts from CSV",
    "Login to SMTP",
    "Send personalized emails"
  ]
},
{
  id: 23,
  title: "Web Scraper Bot",
  description: "Extract product data automatically from websites.",
  level: "Intermediate",
  category: "Automation",
  duration: "1-2 weeks",
  technologies: ["Python", "BeautifulSoup", "Requests"],
  features: ["Scrape Data", "Save to CSV", "Error Handling"],
  resources: [
    { name: "BeautifulSoup Docs", link: "https://beautiful-soup-4.readthedocs.io/en/latest/" },
    { name: "Requests Docs", link: "https://requests.readthedocs.io/en/latest/" },
    { name: "Web Scraping Guide", link: "https://realpython.com/beautiful-soup-web-scraper-python/" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=XQgXKtPSzUI",
  starterCode: `import requests
from bs4 import BeautifulSoup
url = "https://books.toscrape.com/"
page = requests.get(url)
soup = BeautifulSoup(page.text,'html.parser')
titles = [t.text for t in soup.select('h3 a')]
print(titles[:5])`,
  icon: "🤖",
  steps: [
    "Fetch HTML content",
    "Parse data using BeautifulSoup",
    "Export to CSV"
  ]
},
{
  id: 24,
  title: "Browser Automation with Selenium",
  description: "Automate web interactions using Selenium.",
  level: "Advanced",
  category: "Automation",
  duration: "2-3 weeks",
  technologies: ["Python", "Selenium"],
  features: ["Automated Form Filling", "Button Clicks", "Screenshot Capture"],
  resources: [
    { name: "Selenium Docs", link: "https://www.selenium.dev/documentation/" },
    { name: "ChromeDriver Setup", link: "https://chromedriver.chromium.org/getting-started" },
    { name: "XPath Selector Guide", link: "https://www.w3schools.com/xml/xpath_intro.asp" }
  ],
  tutorialLink: "https://www.youtube.com/watch?v=j7VZsCCnptM",
  starterCode: `from selenium import webdriver
driver = webdriver.Chrome()
driver.get('https://google.com')
driver.save_screenshot('screenshot.png')
driver.quit()`,
  icon: "🧩",
  steps: [
    "Set up WebDriver",
    "Automate clicks and forms",
    "Capture screenshots"
  ]
}
  ];

  const filteredProjects = projects.filter(project => {
    const levelMatch = selectedLevel === 'All' || project.level === selectedLevel;
    const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  // Project Builder Component
  const ProjectBuilder = () => (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--card)',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Building: {activeProject.title}</h2>
          {/* User info display like streaks.jsx */}
          {username && (
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              Building as: {username}
            </div>
          )}
          <button 
            onClick={() => setActiveProject(null)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ background: 'var(--bg)', height: '8px', borderRadius: '4px', marginBottom: '10px' }}>
            <div style={{
              background: 'var(--brand)',
              height: '100%',
              borderRadius: '4px',
              width: `${((currentStep + 1) / activeProject.steps.length) * 100}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Step {currentStep + 1} of {activeProject.steps.length}
            {projectProgress[activeProject.id]?.completedSteps?.length > 0 && 
              ` • ${projectProgress[activeProject.id].completedSteps.length} steps completed`
            }
          </p>
        </div>

        <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>Step {currentStep + 1}: {activeProject.steps[currentStep]}</h3>
          {currentStep === 0 && (
            <div>
              <p>Create these files in your project folder:</p>
              <ul>
                <li><code>index.html</code></li>
                <li><code>styles.css</code></li>
                <li><code>script.js</code></li>
              </ul>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Helpful Resources:</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            {activeProject.resources.map((resource, i) => (
              <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" style={{
                display: 'block',
                padding: '10px',
                background: 'var(--bg)',
                borderRadius: '8px',
                color: 'var(--brand)',
                textDecoration: 'none'
              }}>
                📚 {resource.name}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
          <button 
            className="btn outline"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0 || updating}
          >
            Previous Step
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn"
              onClick={() => completeStep(currentStep)}
              disabled={updating}
              style={{ 
                background: projectProgress[activeProject.id]?.completedSteps?.includes(currentStep) ? 'var(--success)' : 'var(--bg)',
                opacity: updating ? 0.6 : 1
              }}
            >
              {updating ? 'Saving...' : 
               projectProgress[activeProject.id]?.completedSteps?.includes(currentStep) ? '✓ Completed' : 'Mark Complete'
              }
            </button>
            <button 
              className="btn primary"
              onClick={() => {
                if (currentStep < activeProject.steps.length - 1) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  completeProject();
                }
              }}
              disabled={updating}
            >
              {updating ? 'Saving...' : 
               currentStep < activeProject.steps.length - 1 ? 'Next Step' : 'Finish Project'
              }
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', background: 'var(--bg)', borderRadius: '8px' }}>
          <h4>Quick Actions:</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn outline"
              style={{ fontSize: '0.8rem' }}
              onClick={() => {
                if (!activeProject?.starterCode) {
                  showSnackbar('No starter code available for this project.', 'error');
                  return;
                }

                const code = activeProject.starterCode;
                const hasHTML = code.includes('<!DOCTYPE html>') || code.includes('<html>');
                
                const penData = {
                  title: activeProject.title || 'My Project',
                  editors: hasHTML ? '101' : '001',
                  html: hasHTML ? code : '',
                  css: '',
                  js: !hasHTML ? code : '',
                };

                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://codepen.io/pen/define';
                form.target = '_blank';

                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'data';
                input.value = JSON.stringify(penData);

                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
              }}
            >
              💻 Open Code Editor
            </button>

            <button 
              className="btn outline" 
              style={{ fontSize: '0.8rem' }}
              onClick={() => copyStarterCode(activeProject.starterCode)}
            >
              📋 Copy Starter Code
            </button>
            <button 
              className="btn outline" 
              style={{ fontSize: '0.8rem' }}
              onClick={() => window.open(activeProject.tutorialLink, '_blank')}
            >
              🎥 Video Tutorial
            </button>
          </div>
          
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              className="btn outline"
              style={{ fontSize: '0.9rem' }}
              onClick={() => {
                setActiveProject(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ← Back to All Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state (exactly like streaks.jsx)
  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div>Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="wrap">
      {activeProject && <ProjectBuilder />}
      
      {/* Snackbar (exactly like streaks.jsx) */}
      {snackbar.open && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: snackbar.severity === 'error' ? '#f44336' : '#4CAF50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 1000,
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          {snackbar.message}
          <button 
            onClick={handleCloseSnackbar}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              marginLeft: '10px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">AlgoRythm</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/learn" className="nav-link">Learn</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Learn by Building Projects</h1>
        <p>Hands-on learning through real project development. Build your portfolio while gaining practical experience!</p>
        
        {/* User info display (like streaks.jsx) */}
        {username && (
          <div style={{ 
            background: 'var(--card)', 
            padding: '15px', 
            borderRadius: '12px', 
            margin: '20px auto',
            maxWidth: '600px',
            border: '1px solid var(--brand)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              Welcome back, <strong>{username}</strong>! 
              {projectProgressId && ` (ID: ${String(projectProgressId).toUpperCase().slice(0, 6)})`}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>
              Your progress is automatically saved as you build projects.
            </p>
          </div>
        )}
      </section>

      {/* Filters */}
      <section style={{ maxWidth: '1000px', margin: '40px auto', textAlign: 'center' }}>
        <h3>Filter Projects:</h3>
        
        <div style={{ margin: '20px 0' }}>
          <h4>By Difficulty:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', margin: '10px 0' }}>
            {difficultyLevels.map(level => (
              <button 
                key={level}
                className={`btn ${selectedLevel === level ? 'primary' : 'outline'}`}
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div style={{ margin: '20px 0' }}>
          <h4>By Category:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', margin: '10px 0' }}>
            {projectCategories.map(category => (
              <button 
                key={category}
                className={`btn ${selectedCategory === category ? 'primary' : 'outline'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <p style={{ color: 'var(--muted)' }}>
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </section>

      {/* Projects Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3>No projects found with these filters</h3>
            <p style={{ color: 'var(--muted)' }}>Try adjusting your filters or view all projects.</p>
            <button 
              className="btn primary"
              onClick={() => {
                setSelectedLevel('All');
                setSelectedCategory('All');
              }}
            >
              View All Projects
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="card">
                {/* Duration badge - top right */}
                <div style={{ 
                  position: 'absolute', 
                  top: '15px', 
                  right: '15px', 
                  background: 'var(--brand)', 
                  color: 'white',
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  ⏱️ {project.duration}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <span className="icon-emoji" style={{ fontSize: '2rem', marginRight: '15px' }}>
                    {project.icon}
                  </span>
                  <div>
                    <h3 style={{ margin: 0 }}>{project.title}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                      <span style={{ 
                        background: 'var(--bg)', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.7rem',
                        color: 'var(--muted)'
                      }}>
                        {project.level}
                      </span>
                      <span style={{ 
                        background: 'var(--bg)', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.7rem',
                        color: 'var(--muted)'
                      }}>
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p style={{ color: 'var(--muted)', marginBottom: '15px', flexGrow: 1 }}>
                  {project.description}
                </p>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    background: 'var(--bg)', 
                    padding: '10px', 
                    borderRadius: '8px',
                    border: '1px solid #b0afafff'
                  }}>
                    <strong style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>Technologies:  </strong>
                    <span style={{ color: 'var(--text)', fontSize: '1.1rem' }}>
                      {project.technologies.join(', ')}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    background: 'var(--bg)', 
                    padding: '10px', 
                    borderRadius: '8px',
                    border: '1px solid #cfc3c3ff'
                  }}>
                    <strong style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>Features: </strong>
                    <span style={{ color: 'var(--text)', fontSize: '1.1rem' }}>
                      {project.features.join(', ')}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  position: 'absolute', 
                  bottom: '15px', 
                  right: '15px', 
                  color: 'var(--muted)',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ 
                    background: 'var(--bg)', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontWeight: 'bold'
                  }}>
                    📝 {project.steps?.length || 5} steps
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '1.2rem' }}>Resources:</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    {project.resources.map((resource, i) => (
                      <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" style={{ 
                        color: 'white', 
                        fontSize: '1.1rem', 
                        textDecoration: 'none',
                        background: 'transparent',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #2a2f3e'
                      }}>
                        • {resource.name}
                      </a>
                    ))}
                  </div>
                </div>

                <button 
                  className="btn primary card-btn"
                  onClick={() => startBuilding(project)}
                  disabled={updating}
                >
                  {updating ? 'Starting...' : 'Start Building'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <section style={{textAlign: 'center', margin: '60px 0', padding: '40px', background: 'var(--card)', borderRadius: '20px', border: '1px solid #22263b'}}>
        <h2>Ready to Build Something Amazing?</h2>
        <p style={{color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 30px'}}>
          Choose a project that matches your skill level and start building your portfolio today!
        </p>
        <Link to="/projects" className="btn outline" style={{padding: '15px 30px', fontSize: '1.1rem', textDecoration: 'none', marginRight: '15px'}}>
          Back to Projects
        </Link>
        <button
          className="btn primary"
          style={{ padding: '15px 30px', fontSize: '1.1rem' }}
          onClick={() => {
            const beginnerProjects = projects.filter(p => p.level === 'Beginner');
            const random = beginnerProjects[Math.floor(Math.random() * beginnerProjects.length)];
            startBuilding(random);
          }}
          disabled={updating}
        >
          {updating ? 'Starting...' : 'Get Personalized Recommendations'}
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Project Building Tips:</h4>
            <p style={{color: 'var(--muted)', margin: '10px 0 0'}}>
              Start small • Focus on one feature at a time • Don't be afraid to break things • 
              Document your progress • Share your work with others
            </p>
            <div className="footer-actions" style={{ marginTop: 18 }}>
              <Link to="/faq" className="footer-button"><span className="icon">❓</span>FAQ</Link>
              <Link to="/feedback" className="footer-button"><span className="icon">💬</span>Share Feedback</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 AlgoRythm. Build, learn, and grow through hands-on projects.</p>
        </div>
      </footer>
    </div>
  );
}