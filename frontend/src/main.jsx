import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import LoginCallback from './LoginCallback'
import Login from './pages/Login'
import RoadmapFilter from './RoadmapFilter'
import RoadmapResult from './RoadmapResult'
import Learn from './Learn'
import LearnFilter from './LearnFilter' // ADD THIS IMPORT
import HTMLCourse from './HTMLCourse'
import JSCourse from './JSCourse'
import PythonCourse from './PythonCourse'
import GitCourse from './GitCourse'
import WebDevelopmentPath from './WebDevelopmentPath' 
import DataSciencePath from './DataSciencePath';
import MobileDevelopmentPath from './MobileDevelopmentPath';
import GameDevelopmentPath from './GameDevelopmentPath';
import AIMLPath from './AIMLPath';
import DevOpsCloudPath from './DevOpsCloudPath';
import TraceFilter from './TraceFilter';
import TraceCoding from './TraceCoding';
import TraceAlgorithms from './TraceAlgorithms';
import FAQ from './pages/FAQ';
import ProjectsFilter from './ProjectsFilter';
import BuildProjects from './BuildProjects';
import RefactorCode from './RefactorCode';
import CreateTest from './CreateTest';
import CreateTestFinal from './CreateTestFinal'
import TestInterface from './TestInterface'
import LearnProjects from './LearnProjects'
import ProjectsChoice from './ProjectsChoice'
import Streaks from './streaks'
import News from "./News";
import Feedback from './Feedback';
import Profile from './pages/Profile';




import './index.css'
import './app.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/roadmap-filter" element={<RoadmapFilter />} />
        <Route path="/roadmap-result" element={<RoadmapResult />} />
        <Route path="/learn-filter" element={<LearnFilter />} /> {/* ADD THIS ROUTE */}
        <Route path="/learn" element={<Learn />} />
        <Route path="/trace" element={<TraceFilter />} />
        <Route path="/trace/coding" element={<TraceCoding />} />
        <Route path="/trace/algorithms" element={<TraceAlgorithms />} />
        <Route path="/projects" element={<ProjectsFilter />} />
        <Route path="/projects/build-projects" element={<BuildProjects />} />
        <Route path="/refactor" element={<RefactorCode />} />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/create-test-final" element={<CreateTestFinal/>}/>
        <Route path="/test-interface" element={<TestInterface/>}/>
        <Route path="/projects/learn-projects" element={<LearnProjects/>}/>
  <Route path="/faq" element={<FAQ/>} />
        <Route path="/streaks" element={<Streaks />} /> 
        <Route path="/projects-choice" element={<ProjectsChoice/>}/>
        <Route path="/news" element={<News />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/login" element={<Login />} />
  <Route path="/login-callback" element={<LoginCallback />} />
  <Route path="/feedback" element={<Feedback />} />
  <Route path="/profile" element={<Profile />} />



        
        {/* Individual Course Pages */}
        <Route path="/learn/html-css-fundamentals" element={<HTMLCourse />} />
        <Route path="/learn/javascript-basics" element={<JSCourse />} />
        <Route path="/learn/python-for-everyone" element={<PythonCourse />} />
        <Route path="/learn/git-github-essentials" element={<GitCourse />} />
        
        {/* Additional learning paths */}
        <Route path="/learn/web-development" element={<WebDevelopmentPath />} />
        <Route path="/learn/data-science" element={<DataSciencePath />} />
        <Route path="/learn/mobile-development" element={<MobileDevelopmentPath />} />
        <Route path="/learn/game-development" element={<GameDevelopmentPath />} />
        <Route path="/learn/ai-ml" element={<AIMLPath />} />
        <Route path="/learn/devops-cloud" element={<DevOpsCloudPath />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)