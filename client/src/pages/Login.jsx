import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibiliy status
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for submit button loading

  const navigate = useNavigate();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Load saved credentials if "Remember Me" was checked
  useEffect(() => {
    const savedEmailOrUsername = localStorage.getItem("savedEmailOrUsername");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmailOrUsername && savedPassword) {
      setEmailOrUsername(savedEmailOrUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before each new login attempt
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        emailOrUsername,
        password,
      });

      if (response.data) {
        setSuccessMessage("Sign in successful!");
        // Save the token in local storage
        localStorage.setItem("authToken", response.data.token);

        // Store credentials if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("savedEmailOrUsername", emailOrUsername);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedEmailOrUsername");
          localStorage.removeItem("savedPassword");
        }

        // On redirect, clear success message to avoid flash messages
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message;

        // Check for account lockout message
        if (message === "Your account is locked! Try again later.") {
          setErrorMessage(
            "Your account has been locked due to too many failed login attempts. Please try again after 24 hours."
          );
        } else {
          setErrorMessage(message || "Invalid email/username or password!");
        }
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className={styles.loginHeader}>
        <div className="app-logo">
          <Link to="/">
            <img src="/assets/spa_logo.webp" alt="SPA logo" />
          </Link>
        </div>
      </header>
      <div className={styles.loginContainer}>
        <div className={styles.loginContent}>
          <div className={styles.loginFormContainer}>
            <div className={styles.loginIntro}>
              <h2>Have An Account?</h2>
            </div>
            <form
              className={styles.loginForm}
              onSubmit={handleLogin}
              noValidate
            >
              <div className={styles.loginInputs}>
                <div className={styles.emailUserInput}>
                  <input
                    type="text"
                    value={emailOrUsername}
                    placeholder="Username/Email Address"
                    size="30"
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                  />
                </div>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Password"
                    size="30"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i
                    onClick={togglePasswordVisibility}
                    className="material-symbols-sharp"
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </i>
                </div>
              </div>
              <div className={styles.submitBtnContainer}>
                <button
                  className={styles.submitBtn}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "SIGNING IN..." : "SIGN IN"}
                </button>
              </div>
              <div className={styles.formMessage}>
                {errorMessage && (
                  <small className={styles.errorMessage}>{errorMessage}</small>
                )}
                {successMessage && (
                  <small className={styles.successMessage}>
                    {successMessage}
                  </small>
                )}
              </div>
              <div className={styles.rememberForgot}>
                <div className={styles.remember}>
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span></span>
                    Remember Me
                  </label>
                </div>
                <div className={styles.forgot}>
                  <Link to="/reset-password">Forgot Password</Link>
                </div>
              </div>
            </form>
            <div className={styles.registerPrompt}>
              <p>
                Don't Have An Account?{" "}
                <Link to="/register" className={styles.registerLink}>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
          <div className={styles.loginImageContainer}>
            <img
              src="/assets/login_image.webp"
              alt="an illustration of a young boy analysing statistics on his academic progress"
              className={styles.loginImage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
