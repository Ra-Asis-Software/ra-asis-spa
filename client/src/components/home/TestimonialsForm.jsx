import { useState } from "react";
import styles from "./TestimonialsForm.module.css";
import { submitTestimonial } from "../../services/testimonialService.js";

const TestimonialsForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    groupName: "",
    testimonial: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear general messages
    if (successMessage || errorMessage) {
      setSuccessMessage("");
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Group Name validation
    if (formData.groupName && formData.groupName.trim()) {
      if (formData.groupName.trim().length < 3) {
        newErrors.groupName =
          "That is too short! This must be at least 3 characters long.";
      } else if (formData.groupName.trim().length > 50) {
        newErrors.groupName =
          "That is too long! This must be less than 50 characters!";
      }
    }

    // Testimonial validation
    if (!formData.testimonial.trim()) {
      newErrors.testimonial = "Please provide your feedback!";
    } else if (formData.testimonial.trim().length < 20) {
      newErrors.testimonial =
        "That is too short! Please provide more feedback.";
    } else if (formData.testimonial.trim().length > 250) {
      newErrors.testimonial = "That is too long! Please provide less feedback.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await submitTestimonial({
        groupName: formData.groupName.trim(),
        testimonial: formData.testimonial.trim(),
      });

      if (response.error) {
        setErrorMessage(response.error);
        setLoading(false);
      } else {
        setSuccessMessage(
          "Your feedback has been submitted, it will be displayed once approved."
        );

        // Wait 7 seconds then close modal and refresh
        setTimeout(() => {
          setLoading(false);
          onSubmit();
        }, 7000);
      }
    } catch (error) {
      setErrorMessage("Sorry, an unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className={styles.testimonialsFormContainer}>
      <h3 className={styles.formTitle}>Share Your Feedback</h3>

      <form onSubmit={handleSubmit} className={styles.testimonialsForm}>
        <div className={styles.formGroup}>
          <label htmlFor="groupName" className={styles.label}>
            Institution / School / Group
          </label>
          <input
            type="text"
            id="groupName"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your institution, school, or group if available"
          />
          {errors.groupName && (
            <span className={styles.errorText}>{errors.groupName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="testimonial" className={styles.label}>
            Your Feedback*
          </label>
          <textarea
            id="testimonial"
            name="testimonial"
            value={formData.testimonial}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Describe your experience with the app (20-250 characters)"
            rows="5"
          />
          <div className={styles.countError}>
            {errors.testimonial && (
              <span className={styles.errorText}>{errors.testimonial}</span>
            )}
            <div className={styles.charCount}>
              {formData.testimonial.length}/250 characters
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {(errorMessage || successMessage) && (
          <div
            className={
              errorMessage ? styles.errorMessage : styles.successMessage
            }
          >
            {errorMessage || successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default TestimonialsForm;
