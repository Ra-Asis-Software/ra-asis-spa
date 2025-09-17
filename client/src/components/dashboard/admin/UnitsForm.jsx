import { useState, useEffect } from "react";
import styles from "./UnitsForm.module.css";
import formStyles from "./UserForm.module.css";
import { addUnit, updateUnit } from "../../../services/unitService";

const UnitsForm = ({ unit, onSubmit, onCancel, mode }) => {
  const [formData, setFormData] = useState({
    unitCode: "",
    unitName: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (unit && mode === "edit") {
      setFormData({
        unitCode: unit.unitCode || "",
        unitName: unit.unitName || "",
      });
    }
  }, [unit, mode]);

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

    // Unit Code Validation
    if (!formData.unitCode) {
      newErrors.unitCode = "You did not enter the unit code!";
    } else if (!/^[A-Za-z0-9]+$/.test(formData.unitCode)) {
      newErrors.unitCode = "Unit code should contain only letters and numbers!";
    } else if (formData.unitCode.length < 3) {
      newErrors.unitCode = "Unit code should be at least 3 characters long!";
    }

    // Unit Name Validation
    if (!formData.unitName) {
      newErrors.unitName = "Please enter the unit name!";
    } else if (formData.unitName.length < 5) {
      newErrors.unitName = "Unit name should be at least 5 characters long!";
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
      if (mode === "create") {
        const result = await addUnit(formData);
        setSuccessMessage(result.message || "Unit created successfully!");
      } else {
        const result = await updateUnit(unit._id, formData);
        setSuccessMessage(result.message || "Unit updated successfully!");
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
    <form
      onSubmit={handleSubmit}
      className={`${styles.unitsForm} ${formStyles.userForm}`}
    >
      <h3 className={formStyles.formTitle}>
        {mode === "create" ? "Create New Unit" : `Edit Unit: ${unit?.unitCode}`}
      </h3>

      <div className={formStyles.formGroup}>
        <label htmlFor="unitCode">Unit Code</label>
        <input
          type="text"
          id="unitCode"
          name="unitCode"
          value={formData.unitCode}
          onChange={handleChange}
          className={formStyles.input}
          placeholder="e.g., COMP101"
        />
        {errors.unitCode && (
          <span className={formStyles.errorText}>{errors.unitCode}</span>
        )}
      </div>

      <div className={formStyles.formGroup}>
        <label htmlFor="unitName">Unit Name</label>
        <input
          type="text"
          id="unitName"
          name="unitName"
          value={formData.unitName}
          onChange={handleChange}
          className={formStyles.input}
          placeholder="e.g., Introduction to Programming"
        />
        {errors.unitName && (
          <span className={formStyles.errorText}>{errors.unitName}</span>
        )}
      </div>

      {errors.submit && <div className={formStyles.error}>{errors.submit}</div>}

      {successMessage && (
        <div className={formStyles.successMessage}>{successMessage}</div>
      )}

      <div className={formStyles.formActions}>
        <button
          type="submit"
          className={formStyles.submitButton}
          disabled={submitting}
        >
          {submitting
            ? "Processing..."
            : mode === "create"
            ? "Create Unit"
            : "Update Unit"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={formStyles.cancelButton}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UnitsForm;
