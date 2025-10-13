import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./UpdatePassword.module.css";
import headerStyles from "./ResetPassword.module.css";

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
      <header className={headerStyles.resetPasswordHeader}>
        <div className="app-logo">
          <Link to="/">
            <img
              src="/assets/spa_logo.webp"
              alt="SPA logo"
              className={headerStyles.resetPasswordLogo}
            />
          </Link>
        </div>
      </header>
      <div className={styles.updatePasswordContainer}>
        <div className={styles.updatePasswordContent}>
          <div className={styles.updatePasswordIntro}>
            <h2>Create New Password</h2>
            <p>
              Your new password must be different from previously used passwords
            </p>
          </div>
          <div className={styles.updatePasswordFormContainer}>
            <form
              className={styles.updatePasswordForm}
              onSubmit={handlePasswordUpdate}
              noValidate
            >
              <div className={styles.newPasswordInput}>
                <label>New Password</label>
                <div className={styles.inputIcon}>
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
              <div className={styles.confirmPasswordInput}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className={styles.resetPasswordBtnContainer}>
                <button
                  className={styles.resetPasswordBtn}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Reset Password"}
                </button>
              </div>
              <div className={styles.formMessage}>
                {message && (
                  <small className={styles.successMessage}>{message}</small>
                )}
                {errors.password && (
                  <small className={styles.errorMessage}>
                    {errors.password}
                  </small>
                )}
                {errors.confirmPass && (
                  <small className={styles.errorMessage}>
                    {errors.confirmPass}
                  </small>
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
