import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams(); // Get the token from the URL
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Call the backend route to verify the email
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response.data.message || 'Something went wrong during verification.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className='email-verification'>
      <h2>Email Verification</h2>
      <p>✅{message}</p>
    </div>
  );
};

export default VerifyEmail;