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
  const [errors, setErrors] = useState({
    password: "",
    confirmPass: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);

  const validate = () => {
    let isValid = true;
    const newErrors = {
      password: "",
      confirmPass: "",
    };
    // Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    if (!newPassword) {
      newErrors.password = "Please enter your preferred password!";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.password = "Password should be at least 8 characters long";
      isValid = false;
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.password =
        "Password should contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.password =
        "Password should contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.password = "Password should contain at least one number";
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      newErrors.password =
        "Password should contain at least one special character";
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPass = "You have to confirm your password here!";
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPass = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(response.data.message);
      setErrors({ password: "", confirmPass: "" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setErrors({
        password: "",
        confirmPass: err.response?.data?.message || "Reset failed",
      });
    } finally {
      setIsLoading(false);
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
                {errors.password && (
                  <small className="error-message">{errors.password}</small>
                )}
                {errors.confirmPass && (
                  <small className="error-message">{errors.confirmPass}</small>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
