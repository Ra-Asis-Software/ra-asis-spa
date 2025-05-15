import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
      <header id="login_header">
        <div className="app-logo">
          <Link to="/">
            <img src="/assets/spa_logo.webp" alt="SPA logo" />
          </Link>
        </div>
      </header>
      <div className="login-container">
        <div className="login-content">
          <div className="login-form">
            <div className="login-intro">
              <h2>Have An Account?</h2>
            </div>
            <form onSubmit={handleLogin} noValidate>
              <div className="login-inputs">
                <div className="email-user-input">
                  <input
                    type="text"
                    value={emailOrUsername}
                    placeholder="Username/Email Address"
                    size="30"
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                  />
                </div>
                <div className="password-input">
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
              <div className="submit-btn">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "SIGNING IN..." : "SIGN IN"}
                </button>
              </div>
              <div className="form-message">
                {errorMessage && (
                  <small className="error-message">{errorMessage}</small>
                )}
                {successMessage && (
                  <small className="success-message">{successMessage}</small>
                )}
              </div>
              <div className="remember-forgot">
                <div className="remember">
                  <form>
                    <label>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span></span>
                      Remember Me
                    </label>
                  </form>
                </div>
                <div className="forgot">
                  <Link to="/reset-password">Forgot Password</Link>
                </div>
              </div>
            </form>
            <div className="register-prompt">
              <p>
                Don"t Have An Account? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </div>
          <div className="login-image">
            <img
              src="/assets/login_image.webp"
              alt="an illustration of a young boy analysing statistics on his academic progress"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
