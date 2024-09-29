import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="login-container">
      <h2>Have An Account?</h2>
      {errorMessage && <small>{errorMessage}</small>}
      {successMessage && <small>{successMessage}</small>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email or Username</label>
          <input
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;