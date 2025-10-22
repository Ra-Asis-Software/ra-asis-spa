import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { loginUser } from "../services/authService.js";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibiliy status
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for submit button loading
  const [errors, setErrors] = useState({});

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

  // Validation Function
  const validateFields = () => {
    const newErrors = {};

    // Email/Username Validation
    if (!emailOrUsername) {
      newErrors.emailOrUsername = "You did not enter your email or username!";
    } else if (emailOrUsername.includes("@")) {
      // Basic email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername)) {
        newErrors.emailOrUsername = "Please enter a valid email address!";
      }
    }

    // Password Validation
    if (!password) {
      newErrors.password = "You did not enter your password!";
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate form
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({ emailOrUsername, password });

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
        if (message === "Your SPA account is locked! Try again later.") {
          setErrorMessage(
            "Your account has been locked due to too many failed login attempts. Please try again after 24 hours."
          );
        } else if (message === "Please verify your email before logging in.") {
          setErrorMessage(
            "Your email is not verified. Check your inbox for the verification link."
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

  // Handle input change to clear errors
  const handleInputChange = (field, value) => {
    if (field === "emailOrUsername") {
      setEmailOrUsername(value);
    } else if (field === "password") {
      setPassword(value);
    }

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className={styles.loginPage}>
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
                    onChange={(e) =>
                      handleInputChange("emailOrUsername", e.target.value)
                    }
                  />
                  {errors.emailOrUsername && (
                    <small className={styles.error}>
                      {errors.emailOrUsername}
                    </small>
                  )}
                </div>
                <div className={styles.passwordInputContainer}>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Password"
                      size="30"
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                    <i
                      onClick={togglePasswordVisibility}
                      className="material-symbols-sharp"
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </i>
                  </div>
                  {errors.password && (
                    <small className={styles.error}>{errors.password}</small>
                  )}
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
    </div>
  );
};

export default Login;
