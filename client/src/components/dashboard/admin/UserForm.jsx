import { useState, useEffect } from "react";
import styles from "./UserForm.module.css";
import Modal from "../../ui/Modal";
import { createUser, updateUser } from "../../../services/adminService";

const UserForm = ({ user, onSubmit, onCancel, mode }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        username: user.username || "",
        password: "", // Empty for edits unless changing password
        role: user.role || "student",
      });
    }
  }, [user, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateFields = () => {
    const newErrors = {};

    // First Name Validation
    if (!formData.firstName)
      newErrors.firstName = "You did not enter the user's first name!";
    else if (!/^[A-Za-z]+$/.test(formData.firstName))
      newErrors.firstName = "First name should contain only letters!";
    else if (formData.firstName.length < 2)
      newErrors.firstName = "First name should be at least 2 characters long!";

    // Last Name Validation
    if (!formData.lastName)
      newErrors.lastName = "Please enter the user's last name!";
    else if (!/^[A-Za-z]+$/.test(formData.lastName))
      newErrors.lastName = "Last name should contain only letters!";
    else if (formData.lastName.length < 2)
      newErrors.lastName = "Last name should be at least 2 characters long!";

    // Phone Number Validation
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Please enter the user's phone number!";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "The phone number provided is invalid!";

    // Email Validation
    if (!formData.email)
      newErrors.email = "Please enter the user's email address!";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address!";

    // Username Validation
    if (!formData.username) newErrors.username = "Please enter a username!";
    else if (!/^[a-z]+$/.test(formData.username))
      newErrors.username =
        "Username should contain only lowercase letters, no special characters!";
    else if (formData.username.length < 3)
      newErrors.username = "Username should be at least 3 characters long!";

    // Password Validation (only for create mode)
    if (mode === "create") {
      if (!formData.password) newErrors.password = "Please enter a password!";
      else if (formData.password.length < 8)
        newErrors.password = "Password should be at least 8 characters long!";
      else if (!/[A-Z]/.test(formData.password))
        newErrors.password =
          "Password should contain at least one uppercase letter!";
      else if (!/[a-z]/.test(formData.password))
        newErrors.password =
          "Password should contain at least one lowercase letter!";
      else if (!/[0-9]/.test(formData.password))
        newErrors.password = "Password should contain at least one number!";
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
        newErrors.password =
          "Password should contain at least one special character!";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      // Prepare data for submission - remove password if empty in edit mode
      const submitData = { ...formData };

      if (mode === "edit" && !submitData.password) {
        delete submitData.password; // Remove password field if empty in edit mode
      }

      if (mode === "create") {
        await createUser(submitData);
        setErrors({});
        setSuccessMessage("User created successfully!");
      } else {
        await updateUser(user._id, submitData);
        setErrors({});
        setSuccessMessage("User updated successfully!");
      }

      // Show success message for 3.5 seconds
      setTimeout(() => {
        setSubmitting(false);
        onSubmit();
      }, 3500);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "An error occurred" });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.userForm}>
      <h3 className={styles.formTitle}>
        {mode === "create"
          ? "Create New User"
          : `Edit ${user?.firstName} ${user?.lastName}'s Details`}
      </h3>

      <div className={styles.formGroup}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.firstName && (
          <span className={styles.errorText}>{errors.firstName}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.lastName && (
          <span className={styles.errorText}>{errors.lastName}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.phoneNumber && (
          <span className={styles.errorText}>{errors.phoneNumber}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.email && (
          <span className={styles.errorText}>{errors.email}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.username && (
          <span className={styles.errorText}>{errors.username}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
        />
        {errors.password && (
          <span className={styles.errorText}>{errors.password}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      {errors.submit && <div className={styles.error}>{errors.submit}</div>}

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting}
        >
          {submitting
            ? "Processing..."
            : mode === "create"
            ? "Create User"
            : "Update User"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
