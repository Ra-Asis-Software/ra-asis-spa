import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams(); // Get the token from the URL
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Call the backend route to verify the email
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage(
          error.response.data.message ||
            "Something went wrong during verification."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="email-verification">
      <h2>Email Verification</h2>
      <p>
        <span>✅</span>
        {message}
      </p>
      <Link to="/login" target="_blank" rel="noopener noreferrer">
        Login To Your Account
      </Link>
    </div>
  );
};

export default VerifyEmail;
