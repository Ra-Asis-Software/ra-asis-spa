import { useEffect, useState, useContext } from "react";
import styles from "./ContactForm.module.css";
import { sendUserInquiry } from "../../services/userService.js";

const ContactForm = ({ user }) => {
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

  //  Auto-fill for authenticated users
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }));
    } else {
      //  if user logs out, clear data
      setFormData((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        email: "",
      }));
    }
  }, [user]);

  //  onChange that clears field error
  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Updated validation
  const validateFields = () => {
    const newErrors = {};

    // Required fields
    if (!firstName) newErrors.firstName = "You did not enter your first name!";
    else if (!/^[A-Za-z]+$/.test(firstName))
      newErrors.firstName = "Your first name should contain only letters!";
    else if (firstName.length < 2)
      newErrors.firstName =
        "Your first name should be at least 2 characters long!";

    if (!lastName) newErrors.lastName = "Please enter your last name!";
    else if (!/^[A-Za-z]+$/.test(lastName))
      newErrors.lastName = "Your last name should contain only letters!";
    else if (lastName.length < 2)
      newErrors.lastName =
        "Your last name should be at least 2 characters long!";

    if (!email) newErrors.email = "Please enter your email address!";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email address!";

    if (!message.trim()) {
      newErrors.message = "Please provide your message!";
    } else if (message.trim().length < 20) {
      newErrors.message = "That is too short! Please provide more details.";
    } else if (message.trim().length > 750) {
      newErrors.message =
        "That is too long! Please keep it under 750 characters.";
    }

    // Optional validations (only if user typed something)
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "The phone number you provided is invalid!";
    }
    if (title && title.length < 2) {
      newErrors.title = "Title should be at least 2 characters long!";
    }
    if (school && school.length < 2) {
      newErrors.school =
        "Institution/School/Group name should be at least 2 characters long!";
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
    const inquirySubmitted = await sendUserInquiry(formData);

    if (inquirySubmitted.error) {
      setErrorMessage("Something went wrong. Please try again!");
      setSuccessMessage("");
    } else {
      setSuccessMessage(
        "Your message has been sent successfully. We'll get back to you soon!"
      );
      setErrorMessage("");
      setErrors({});

      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: "",
        title: "",
        school: "",
        message: "",
      });
    }

    setIsLoading(false);
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 7000);
  };

  return (
    <div className={styles.contactFormContainer} id="support">
      <div className={styles.contactFormIntro}>
        <h2>Let's Connect</h2>
        <p>
          Fill out the form below to make an inquiry or start a discussion on
          how Ra'Analytica can help your school, your group or just you.
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
                onChange={onChange}
                autoComplete="given-name"
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
                onChange={onChange}
                autoComplete="family-name"
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
                onChange={onChange}
                autoComplete="email"
              />
              {errors.email && (
                <small className={styles.error}>{errors.email}</small>
              )}
            </div>
            <div className={styles.inputContainer}>
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onChange}
                autoComplete="tel"
              />
              {errors.phoneNumber && (
                <small className={styles.error}>{errors.phoneNumber}</small>
              )}
            </div>
          </div>

          <div className={`${styles.contactTitleSchool} ${styles.formSection}`}>
            <div className={styles.inputContainer}>
              <label>Title/Position</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
              />
              {errors.title && (
                <small className={styles.error}>{errors.title}</small>
              )}
            </div>
            <div className={styles.inputContainer}>
              <label>Institution/School/Group</label>
              <input
                type="text"
                name="school"
                value={school}
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
