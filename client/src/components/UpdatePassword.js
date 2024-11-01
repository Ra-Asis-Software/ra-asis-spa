import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      setError("");

      // Redirect after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong! Please try again.");
      setMessage("");
    }
  };

  return (
    <>
        <header id="reset_password_header">
            <div className="app-logo">
                <Link to="/">
                    <img src="/assets/spa_logo.svg" alt="SPA logo" />
                </Link>
            </div>
        </header>
        <div className="update-password-container">
            <div className="update-password-content">
                <div className="update-password-intro">
                    <h2>Create New Password</h2>
                    <p>Your new password must be different from previously used passwords</p>
                </div>
                <div className="update-password-form">
                    <form onSubmit={handlePasswordUpdate} noValidate>
                        <div className="new-password-input">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="confirm-password-input">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="reset-password-btn">
                            <button type="submit">Reset Password</button>
                        </div>
                        <div className="form-message">
                            {message && <small className="success-message">{message}</small>}
                            {error && <small className="error-message">{error}</small>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
  );
};

export default UpdatePassword;