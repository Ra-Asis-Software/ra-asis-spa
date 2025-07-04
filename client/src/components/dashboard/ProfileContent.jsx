import { useState, useEffect } from "react";
import styles from "./css/ProfileContent.module.css";
import { getUserDetails } from "../../services/userService";
import {
  studentBar,
  teacherBar,
  parentBar,
} from "./css/SideBarStyles.module.css";

const ProfileContent = ({ user }) => {
  const [userData, setUserData] = useState({});
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [detailsHolder, setDetailsHolder] = useState({});
  const [editable, setEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const details = await getUserDetails(user.role, user.id);

      if (details?.data?.message) {
        const tempProfile = details.data.data.profile;
        setUserData(tempProfile);
        setDetailsHolder(tempProfile);
      }
    };
    fetchUserDetails();
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (
      passwordData.newPassword &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      alert("New passwords do not match!");
      return;
    }
    const finalData = { ...userData };
    if (passwordData.newPassword) {
      finalData.password = passwordData.newPassword;
    }
    console.log("Saving changes:", finalData);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setUserData(detailsHolder);
    setPasswordData({ newPassword: "", confirmPassword: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setUserData((prev) => ({ ...prev, profilePic: reader.result }));
      setShowUploadModal(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.editButtonDiv}>
        <button
          className={`${styles.editButton} ${
            user.role === "student"
              ? studentBar
              : user.role === "teacher"
              ? teacherBar
              : user.role === "parent" && parentBar
          }`}
          onClick={() => setEditable((prev) => !prev)}
        >
          {editable ? "Close" : "Edit"}
        </button>
      </div>
      <form className={styles.profileLayout} onSubmit={handleSaveChanges}>
        <div className={styles.leftPanel}>
          <div className={styles.profilePicWrapper}>
            <div className={styles.profilePicBox}>
              <img
                src={userData.profilePic || "/assets/expert_support.webp"}
                alt="Profile"
                className={styles.profilePic}
              />
            </div>
            <button
              type="button"
              className={styles.addPicButton}
              onClick={() => setShowUploadModal(true)}
              aria-label="Change profile picture"
            >
              +
            </button>
          </div>
          <input
            type="text"
            name="name"
            value={`${userData.firstName} ${userData.lastName}`}
            disabled
            className={`${styles.textInput} ${styles.userName}`}
          />
          <input
            type="text"
            name="role"
            value={userData.role}
            disabled
            className={`${styles.textInput} ${styles.userRole}`}
          />
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              disabled={!editable}
              value={userData.email}
              onChange={handleUserChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phoneNumber"
              disabled={!editable}
              value={userData.phoneNumber}
              onChange={handleUserChange}
            />
          </div>

          <h3
            className={styles.passwordHeader}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            Change Password
          </h3>

          {showPassword && (
            <>
              <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
              </div>
            </>
          )}

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.saveButton} ${
                user.role === "student"
                  ? studentBar
                  : user.role === "teacher"
                  ? teacherBar
                  : user.role === "parent" && parentBar
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Upload Document</h3>
            {/* <button className={styles.upload-button}> */}
            <div className={styles.iconWrapper}>
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            {/* </button> */}
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowUploadModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className={`${styles.continueButton} `}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
