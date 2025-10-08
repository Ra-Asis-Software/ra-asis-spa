import { useState } from "react";
import styles from "./css/TestimonialsForm.module.css";

const TestimonialForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [errors, setErrors] = useState({ title: "", testimonial: "" });

  const validate = () => {
    const newErrors = { title: "", testimonial: "" };

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!testimonial.trim()) {
      newErrors.testimonial = "Testimonial cannot be empty.";
    } else if (testimonial.length < 20) {
      newErrors.testimonial = "Testimonial must be at least 20 characters.";
    } else if (testimonial.length > 175) {
      newErrors.testimonial = "Testimonial cannot exceed 175 characters.";
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.testimonial;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      testimonial: testimonial.trim(),
    });

    setTitle("");
    setTestimonial("");
    setErrors({ title: "", testimonial: "" });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} noValidate className={styles.modalBox}>
        <h2>Leave a Testimonial</h2>

        {/* Title Field */}
        <div className={styles.fieldGroup}>
          <input
            type="text"
            placeholder="Title"
            className={styles.titleFieldsInputs}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
          />
          {errors.title && (
            <p className={styles.errorMessage}>{errors.title}</p>
          )}
        </div>

        {/* Testimonial Textarea */}
        <div className={styles.fieldGroup}>
          <textarea
            className={`${styles.titleFieldsInputs} ${styles.modalTextarea}`}
            value={testimonial}
            onChange={(e) => {
              setTestimonial(e.target.value);
              if (errors.testimonial)
                setErrors((prev) => ({ ...prev, testimonial: "" }));
            }}
            placeholder="Write your testimonial..."
          />
          {errors.testimonial && (
            <p className={styles.errorMessage}>{errors.testimonial}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
