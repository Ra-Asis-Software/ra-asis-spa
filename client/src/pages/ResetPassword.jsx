import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
      <header id="reset_password_header">
        <div className="app-logo">
          <Link to="/">
            <img src="/assets/spa_logo.webp" alt="SPA logo" />
          </Link>
        </div>
      </header>
      <div className="reset-password">
        {status === "success" ? (
          <div className="request-success">
            <div className="success-icon">
              <img
                src="/assets/email_icon.webp"
                alt="Envelope icon with an @ symbol to show sending mail was successfull"
              />
            </div>
            <div className="success-text">
              <h2>Check Your Mail</h2>
              <p>We have sent password recovery instructions to your email</p>
            </div>
            <div className="mail-app-btn">
              <button onClick={handleOpenMailApp}>Open the mail app</button>
            </div>
            <div className="try-again-text">
              <p>
                Did not receive the email? Check your spam folder or{" "}
                <Link to="/reset-password">try another email address</Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="request-container">
            <div className="reset-password-intro">
              <p>
                Enter the email address associated with your account, and we
                will send you a link to reset your password
              </p>
            </div>
            <div className="request-reset-form">
              <form onSubmit={handleSubmit} noValidate>
                <div className="email-input">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="get-link-btn">
                  <button type="submit" disabled={loading}>
                    {loading ? "Preparing Link..." : "Get Link"}
                  </button>
                </div>
                <div className="form-message">
                  {status === "error" && (
                    <small className="error-message">
                      Something went wrong when sending reset link. Please try
                      again.
                    </small>
                  )}
                </div>
              </form>
            </div>
            <div className="reset-password-img">
              <img
                src="/assets/password_reset.webp"
                alt="a boy holding a broken key which is stuck on the padlock in the background. An analogy of a lost password."
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
