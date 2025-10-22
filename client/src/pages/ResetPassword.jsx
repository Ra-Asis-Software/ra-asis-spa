import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import { requestPasswordReset } from "../services/authService.js";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Email field validation
  const validateFields = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "You did not enter your email address!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address!";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous status and errors
    setStatus("");
    setErrors({});

    // Validate form
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await requestPasswordReset(email, window.location.origin);
      setStatus("success");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "No user found with this email address"
      ) {
        setErrors({ email: "No account found with this email address!" });
      } else {
        setStatus("error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setEmail(value);

    // Clear email error when user starts typing
    if (errors.email) {
      setErrors({});
    }

    // Clear status when user starts typing
    if (status === "error") {
      setStatus("");
    }
  };

  const handleOpenMailApp = () => {
    const emailDomain = email.split("@")[1];
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Map email domains to app inboxes
    const mailAppLinks = {
      "gmail.com": isMobile ? "googlegmail://inbox" : "mailto:",
      "yahoo.com": isMobile ? "ymail://inbox" : "mailto:",
      "outlook.com": isMobile ? "ms-outlook://inbox" : "mailto:",
      "icloud.com": isMobile ? "message://" : "mailto:",
    };

    // Determine the app URL or fallback to mailto
    const emailURL = mailAppLinks[emailDomain] || "mailto:";

    // Attempt to open the app
    window.location.href = emailURL + email;
  };

  return (
    <>
      <header className={styles.resetPasswordHeader}>
        <div className="app-logo">
          <Link to="/">
            <img
              src="/assets/spa_logo.webp"
              alt="SPA logo"
              className={styles.resetPasswordLogo}
            />
          </Link>
        </div>
      </header>
      <div className={styles.resetPassword}>
        {status === "success" ? (
          <div className={styles.requestSuccess}>
            <div className={styles.successIconContainer}>
              <img
                src="/assets/email_icon.webp"
                alt="Envelope icon with an @ symbol to show sending mail was successfull"
                className={styles.successIcon}
              />
            </div>
            <div className={styles.successText}>
              <h5>Check Your Mail</h5>
              <p>We have sent password recovery instructions to your email</p>
            </div>
            <div className={styles.mailAppBtnContainer}>
              <button className={styles.mailAppBtn} onClick={handleOpenMailApp}>
                Open the mail app
              </button>
            </div>
            <div className={styles.tryAgainText}>
              <p>
                Did not receive the email? Check your spam folder or{" "}
                <Link to="/reset-password">try another email address</Link>
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.requestContainer}>
            <div className={styles.resetPasswordIntro}>
              <p>
                Enter the email address associated with your account, and we
                will send you a link to reset your password
              </p>
            </div>
            <div className={styles.requestResetFormContainer}>
              <form
                className={styles.requestResetForm}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className={styles.emailInput}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <small className={styles.error}>{errors.email}</small>
                  )}
                </div>
                <div className={styles.getLinkBtnContainer}>
                  <button
                    className={styles.getLinkBtn}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Preparing Link..." : "Get Link"}
                  </button>
                </div>
                <div className={styles.formMessage}>
                  {status === "error" && (
                    <small className={styles.errorMessage}>
                      Something went wrong when sending reset link. Please try
                      again.
                    </small>
                  )}
                </div>
              </form>
            </div>
            <div className={styles.resetPasswordImgContainer}>
              <img
                src="/assets/password_reset.webp"
                alt="a boy holding a broken key which is stuck on the padlock in the background. An analogy of a lost password."
                className={styles.resetPasswordImg}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
