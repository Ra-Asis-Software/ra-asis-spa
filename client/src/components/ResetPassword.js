import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/auth/reset-password', { email });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      {status === 'success' ? (
        <div>
          <i className="success-icon"></i>
          <h2>Check Your Mail</h2>
          <p>We have sent password recovery instructions to your email.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password?</h1>
          <p>Enter the email address associated with your account, and we’ll send you a link to reset your password.</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Get Link'}
          </button>
          {status === 'error' && <small>Something went wrong when sending reset link. Please try again.</small>}
        </form>
      )}
    </div>
  );
};

export default ResetPassword;