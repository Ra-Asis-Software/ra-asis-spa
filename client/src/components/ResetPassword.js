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
      await axios.post('/api/auth/reset-password', { 
        email,
        frontendUrl: window.location.origin
     });
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
        <>
            <div className="reset-password-intro">
                <p>
                    Enter the email address associated with your account, and we will send you a link to reset your password
                </p>
            </div>
            <div className="request-reset-form">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="email-input">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="get-link-btn">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Preparing Link...' : 'Get Link'}
                        </button>
                    </div>
                    <div className="form-message">
                        {status === 'error' && <small className="error-message">Something went wrong when sending reset link. Please try again.</small>}
                    </div>
                </form>
            </div>
            <div className="reset-password-img">
                <img src="/assets/password_reset.webp" alt="" />
            </div>
        </>
      )}
    </div>
  );
};

export default ResetPassword;