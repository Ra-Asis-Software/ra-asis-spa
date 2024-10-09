import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { emailOrUsername, password });
      
      if (response.data) {
        setSuccessMessage('Login successful!');
        // Save the token in local storage
        localStorage.setItem('authToken', response.data.token);
        
        // Redirect to the dashboard or home page
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage(error.response && error.response.data.message
        ? error.response.data.message
        : 'Invalid email/username or password!');
    }
  };

  return (
    <>
      <header id="login_header">
        <div className='app-logo'>
            <Link to="/">
                <img src="/assets/spa_logo.svg" alt="SPA logo" />
            </Link>
        </div>
      </header>
      <div className="login-container">
        <div className="login-content">
          <div className="login-form">
            <div className="login-intro">
              <h2>Have An Account?</h2>
            </div>
            <form onSubmit={handleLogin} noValidate>
              <div className="login-inputs">
                <div className="email-user-input">
                  <input
                    type="text"
                    value={emailOrUsername}
                    placeholder="Username/Email Address"
                    size="30"
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                  />
                </div>
                <div className="password-input">
                  <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    size="30"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="submit-btn">
                <button type="submit">SIGN IN</button>
              </div>
              <div className='form-message'>
                {errorMessage && <small className="error-message">{errorMessage}</small>}
                {successMessage && <small className="success-message">{successMessage}</small>}
              </div>
              <div className="remember-forgot">
                <div className="remember">
                  <form>
                    <label>
                      <input type="checkbox"/>
                      <span></span>
                      Remember Me
                    </label>
                  </form>
                </div>
                <div className="forgot">
                  <Link to="/password-reset">Forgot Password</Link>
                </div>
              </div>
            </form>
            <div className="register-prompt">
                <p>Don't Have An Account? <Link to="/register">Sign Up</Link></p>
            </div>
          </div>
          <div className="login-image">
            <img src="/assets/login_image.webp" alt="an illustration of a young boy analysing statistics on his academic progress" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;