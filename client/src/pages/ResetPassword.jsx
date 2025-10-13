import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", {
        email,
        frontendUrl: window.location.origin,
      });
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMailApp = () => {
    const emailDomain = email.split("@")[1];
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Mapping of email domains to app inboxes. Not sure if this works correctly. Tutaconfirm in prod.
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
              <button className={styles.mailAppBtn} onClick={handleOpenMailApp}>Open the mail app</button>
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
              <form className={styles.requestResetForm} onSubmit={handleSubmit} noValidate>
                <div className={styles.emailInput}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.getLinkBtnContainer}>
                  <button className={styles.getLinkBtn} type="submit" disabled={loading}>
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
