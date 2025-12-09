import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { SecureTokenManager } from '../security';

export default function Login() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);

    // Check URL for errors
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Login error:', error);
      // Clear any existing tokens on error (defensive: SecureTokenManager may be undefined)
      try {
        SecureTokenManager?.clearLogin?.();
      } catch (e) {
        console.warn('SecureTokenManager.clearLogin failed:', e);
      }
    }

    // If there's an expired token, clear it. Do NOT auto-redirect — stay on the login page
  const { token } = (SecureTokenManager?.getLoginTokens?.() || { token: null });
    const timestamp = sessionStorage.getItem('github_login_time');

    if (token && timestamp) {
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (tokenAge >= maxAge) {
        console.log('Token expired, clearing...');
        try { SecureTokenManager?.clearLogin?.(); } catch(e) { console.warn('clearLogin failed', e); }
      } else {
        console.log('Valid token present, but will not auto-redirect. Click Login to continue.');
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    console.log('🚀 Redirecting to GitHub OAuth...');
  // Clear any old tokens before starting new login (defensive)
  try { SecureTokenManager?.clearLogin?.(); } catch(e) { console.warn('clearLogin failed', e); }
    
    // Redirect to backend OAuth endpoint which starts the GitHub authentication flow
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          @keyframes shooting-star {
            0% {
              transform: translate(0, 0) rotate(-45deg);
              opacity: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: translate(-300px, 300px) rotate(-45deg);
              opacity: 0;
            }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes glow-pulse {
            0%, 100% { 
              box-shadow: 
                0 0 20px rgba(138, 180, 248, 0.5),
                0 0 40px rgba(138, 180, 248, 0.3),
                0 0 60px rgba(138, 180, 248, 0.2),
                0 0 80px rgba(138, 180, 248, 0.1),
                inset 0 0 20px rgba(138, 180, 248, 0.2);
            }
            50% { 
              box-shadow: 
                0 0 30px rgba(138, 180, 248, 0.8),
                0 0 60px rgba(138, 180, 248, 0.5),
                0 0 90px rgba(138, 180, 248, 0.3),
                0 0 120px rgba(138, 180, 248, 0.2),
                inset 0 0 30px rgba(138, 180, 248, 0.3);
            }
          }

          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
          }

          .space-container {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
          }

          .stars {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle linear infinite;
          }

          .shooting-star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(90deg, #fff, transparent);
            border-radius: 50%;
            animation: shooting-star linear infinite;
          }

          .shooting-star::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
          }

          .shooting-star::after {
            content: '';
            position: absolute;
            top: -1px;
            right: -2px;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, rgba(255,255,255,1), transparent);
            border-radius: 50%;
          }

          .celestial-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            animation: float 6s ease-in-out infinite;
          }

          .cosmic-circle {
            position: relative;
            width: 350px;
            height: 350px;
            margin: 0 auto 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .orbit-ring {
            position: absolute;
            border: 1px solid rgba(138, 180, 248, 0.2);
            border-radius: 50%;
            animation: orbit linear infinite;
          }

          .orbit-ring-1 {
            width: 200px;
            height: 200px;
            animation-duration: 20s;
          }

          .orbit-ring-2 {
            width: 260px;
            height: 260px;
            animation-duration: 30s;
            animation-direction: reverse;
          }

          .orbit-ring-3 {
            width: 320px;
            height: 320px;
            animation-duration: 40s;
          }

          .planet {
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #8ab4f8, #4a90e2);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(138, 180, 248, 0.8);
          }

          .login-orb {
            position: relative;
            width: 180px;
            height: 180px;
            background: radial-gradient(circle at 30% 30%, 
              rgba(138, 180, 248, 0.4) 0%,
              rgba(74, 144, 226, 0.3) 30%,
              rgba(30, 64, 175, 0.2) 60%,
              transparent 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: glow-pulse 3s ease-in-out infinite;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(138, 180, 248, 0.3);
          }

          .login-orb:hover {
            transform: scale(1.05);
            border-color: rgba(138, 180, 248, 0.6);
          }

          .login-orb::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 255, 0.3),
              transparent 50%);
            opacity: 0.5;
          }

          .login-text {
            position: relative;
            z-index: 2;
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 0 10px rgba(138, 180, 248, 0.8);
            letter-spacing: 1px;
          }

          .title {
            font-size: 56px;
            font-weight: 700;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #fff 0%, #8ab4f8 50%, #4a90e2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 40px rgba(138, 180, 248, 0.3);
            letter-spacing: 2px;
          }

          .subtitle {
            color: rgba(255, 255, 255, 0.7);
            font-size: 16px;
            margin-bottom: 50px;
            letter-spacing: 1px;
          }

          .fade-in {
            opacity: 0;
            animation: fadeIn 1s ease-in forwards;
          }

          @keyframes fadeIn {
            to { opacity: 1; }
          }

          .nebula {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.3;
            animation: float 20s ease-in-out infinite;
          }

          .nebula-1 {
            top: 10%;
            left: 15%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(138, 180, 248, 0.4), transparent);
            animation-delay: 0s;
          }

          .nebula-2 {
            bottom: 15%;
            right: 20%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(147, 112, 219, 0.3), transparent);
            animation-delay: 3s;
          }

          .nebula-3 {
            top: 50%;
            left: 50%;
            width: 500px;
            height: 500px;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, rgba(74, 144, 226, 0.2), transparent);
            animation-delay: 6s;
          }
        `}
      </style>

      <div className="space-container">
        {/* Nebula effects */}
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>

        {/* Background stars */}
        <div className="stars">
          {[...Array(100)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}

          {/* Shooting stars */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="shooting-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Celestial center with login */}
        <div className={`celestial-center ${visible ? 'fade-in' : ''}`}>
          <h1 className="title">AlgoRythm</h1>
          <p className="subtitle">Code your universe, one algorithm at a time</p>

          <div className="cosmic-circle">
            {/* Orbital rings */}
            <div className="orbit-ring orbit-ring-1">
              <div className="planet"></div>
            </div>
            <div className="orbit-ring orbit-ring-2">
              <div className="planet"></div>
            </div>
            <div className="orbit-ring orbit-ring-3">
              <div className="planet"></div>
            </div>

            {/* Central login orb */}
            <div className="login-orb" onClick={handleLogin}>
              <div className="login-text">Login with GitHub</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)",
    color: "#fff",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    position: "relative",
    overflow: "hidden",
  },
};