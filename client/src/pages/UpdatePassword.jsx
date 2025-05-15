import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);

  const validate = () => {
    const newErrors = {};
    // Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    if (!newPassword)
      newErrors.password = "Please enter your preferred password!";
    else if (newPassword.length < 8)
      newErrors.password = "Password should be at least 8 characters long";
    else if (!/[A-Z]/.test(newPassword))
      newErrors.password =
        "Password should contain at least one uppercase letter";
    else if (!/[a-z]/.test(newPassword))
      newErrors.password =
        "Password should contain at least one lowercase letter";
    else if (!/[0-9]/.test(newPassword))
      newErrors.password = "Password should contain at least one number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword))
      newErrors.password =
        "Password should contain at least one special character";

    // Confirm password validation
    if (!confirmPassword)
      newErrors.confirmPass = "You have to confirm your password here!";
    else if (confirmPassword !== newPassword)
      newErrors.confirmPass = "Passwords do not match";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      setIsLoading(true);

      try {
        const response = await axios.post(`/api/auth/reset-password/${token}`, {
          newPassword,
        });
        setMessage(response.data.message);
        setError({});

        // Redirect after successful reset
        setTimeout(() => {
          navigate("/login");
        }, 4000); // Redirect after 4 seconds
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong! Please try again."
        );
        setMessage("");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <header id="reset_password_header">
        <div className="app-logo">
          <Link to="/">
            <img src="/assets/spa_logo.webp" alt="SPA logo" />
          </Link>
        </div>
      </header>
      <div className="update-password-container">
        <div className="update-password-content">
          <div className="update-password-intro">
            <h2>Create New Password</h2>
            <p>
              Your new password must be different from previously used passwords
            </p>
          </div>
          <div className="update-password-form">
            <form onSubmit={handlePasswordUpdate} noValidate>
              <div className="new-password-input">
                <label>New Password</label>
                <div className="input-icon">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <i
                    onClick={toggleNewPasswordVisibility}
                    className="material-symbols-sharp"
                  >
                    {showNewPassword ? "visibility_off" : "visibility"}
                  </i>
                </div>
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
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Reset Password"}
                </button>
              </div>
              <div className="form-message">
                {message && (
                  <small className="success-message">{message}</small>
                )}
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
