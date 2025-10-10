import { useState, useEffect } from "react";
import styles from "./ContactForm.module.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    title: "",
    school: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { firstName, lastName, email, phoneNumber, title, school, message } =
    formData;

  // Handle input change
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation Function
  const validateFields = () => {
    const newErrors = {};

    // First Name Validation
    if (!firstName) newErrors.firstName = "You did not enter your first name!";
    else if (!/^[A-Za-z]+$/.test(firstName))
      newErrors.firstName = "Your first name should contain only letters!";
    else if (firstName.length < 2)
      newErrors.firstName =
        "Your first name should be at least 2 characters long!";

    // Last Name Validation
    if (!lastName) newErrors.lastName = "Please enter your last name!";
    else if (!/^[A-Za-z]+$/.test(lastName))
      newErrors.lastName = "Your last name should contain only letters!";
    else if (lastName.length < 2)
      newErrors.lastName =
        "Your last name should be at least 2 characters long!";

    // Email Validation
    if (!email) newErrors.email = "Please enter your email address!";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email address!";

    // Phone Number Validation
    if (!phoneNumber) newErrors.phoneNumber = "Please enter your phone number!";
    else if (!/^\d{10}$/.test(phoneNumber))
      newErrors.phoneNumber = "The phone number you provided is invalid!";

    // Title Validation
    if (!title) newErrors.title = "Please enter your title!";
    else if (title.length < 2)
      newErrors.title = "Title should be at least 2 characters long!";

    // School/Group Validation
    if (!school) newErrors.school = "Please enter your school/group name!";
    else if (school.length < 2)
      newErrors.school =
        "School/Group name should be at least 2 characters long!";

    if (!message.trim()) {
      newErrors.message = "Please provide your message!";
    } else if (message.trim().length < 20) {
      newErrors.message = "That is too short! Please provide more details.";
    } else if (message.trim().length > 500) {
      newErrors.message =
        "That is too long! Please keep it under 500 characters.";
    }

    return newErrors;
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateFields();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage("");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Contact Form Submission:", formData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage(
        "Your message has been sent successfully. We'll get back to you soon!"
      );
      setErrorMessage("");
      setErrors({});

      // Reset form fields after submit
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        title: "",
        school: "",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrorMessage("Something went wrong. Please try again!");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-clear success message after 7 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className={styles.contactFormContainer}>
      <div className={styles.contactFormIntro}>
        <h2>Let's Connect</h2>
        <p>
          Fill out the form below to make an inquiry or start a discussion on
          how Ra'Asis Analytica can help your school, your group or just you.
        </p>
      </div>
      <div className={styles.contactFormFields}>
        <form
          className={styles.landingContactForm}
          onSubmit={onSubmit}
          noValidate
        >
          <div className={`${styles.contactNames} ${styles.formSection}`}>
            <div className={styles.inputContainer}>
              <label>
                First Name<span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                size="30"
                onChange={onChange}
              />
              {errors.firstName && (
                <small className={styles.error}>{errors.firstName}</small>
              )}
            </div>
            <div className={styles.inputContainer}>
              <label>
                Last Name<span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                size="30"
                onChange={onChange}
              />
              {errors.lastName && (
                <small className={styles.error}>{errors.lastName}</small>
              )}
            </div>
          </div>
          <div className={`${styles.contactEmailPhone} ${styles.formSection}`}>
            <div className={styles.inputContainer}>
              <label>
                Email Address<span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                size="30"
                onChange={onChange}
              />
              {errors.email && (
                <small className={styles.error}>{errors.email}</small>
              )}
            </div>
            <div className={styles.inputContainer}>
              <label>
                Phone Number<span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                size="30"
                onChange={onChange}
              />
              {errors.phoneNumber && (
                <small className={styles.error}>{errors.phoneNumber}</small>
              )}
            </div>
          </div>
          <div className={`${styles.contactTitleSchool} ${styles.formSection}`}>
            <div className={styles.inputContainer}>
              <label>
                Title<span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={title}
                size="30"
                onChange={onChange}
              />
              {errors.title && (
                <small className={styles.error}>{errors.title}</small>
              )}
            </div>
            <div className={styles.inputContainer}>
              <label>
                School/Group<span className={styles.requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="school"
                value={school}
                size="30"
                onChange={onChange}
              />
              {errors.school && (
                <small className={styles.error}>{errors.school}</small>
              )}
            </div>
          </div>
          <div className={styles.contactMessage}>
            <div className={styles.inputContainer}>
              <textarea
                name="message"
                value={message}
                placeholder="How can we be of help to you"
                onChange={onChange}
              ></textarea>
              {errors.message && (
                <small className={styles.error}>{errors.message}</small>
              )}
            </div>
          </div>
          <div className={styles.submitButtonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Sending Message..." : "Send Message"}
            </button>
          </div>
          <div className={styles.formMessage}>
            {successMessage && (
              <small className={styles.successMessage}>{successMessage}</small>
            )}
            {errorMessage && (
              <small className={styles.errorMessage}>{errorMessage}</small>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
