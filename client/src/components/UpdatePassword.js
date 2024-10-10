import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      setError('');

      // Redirect after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong! Please try again.');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordUpdate}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <small className="success-message">{message}</small>}
      {error && <small className="error-message">{error}</small>}
    </div>
  );
};

export default UpdatePassword;