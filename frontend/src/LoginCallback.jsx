import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SecureTokenManager } from './security';

const LoginCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loginToken = searchParams.get('login_token');
    const loginUsername = searchParams.get('login_username');
    const error = searchParams.get('error');

    if (error) {
      console.error('Login failed:', error);
      navigate('/login?error=auth_failed');
      return;
    }

    if (loginToken && loginUsername) {
      // Store login tokens securely for this session
      SecureTokenManager.setLoginTokens(loginToken, loginUsername);

      // Redirect to dashboard or home
      navigate('/');
    } else {
      // No tokens found, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="wrap">
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Completing login...</h2>
        <p>Please wait while we secure your session.</p>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginCallback;