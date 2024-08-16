// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgriLink_backend } from 'declarations/AgriLink_backend';
import './Auth.scss';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');

    try {
      const result = await AgriLink_backend.loginWithII();
      if ('ok' in result) {
        navigate('/dashboard');
      } else {
        setError('Login failed: ' + result.err);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLogin} className="auth-button">Login with Internet Identity</button>
      </div>
    </div>
  );
};

export default Login;