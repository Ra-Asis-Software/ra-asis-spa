import { useState, useEffect } from "react";
import styles from "./Testimonials.module.css";

const Testimonials = ({ isAuthenticated }) => {
  const users = [
    {
      name: "Allan Kimutai",
      title: "Teacher, Lugulu Girls High School",
      testimonial:
        "Ra'Asis SPA is a one-stop shop where you can manage information and reports concerning students, teachers, support staff, and parents with ease. It is fast, accessible, and reliable from any web browser or mobile phone.",
    },
    {
      name: "Fridah Muthoni",
      title: "Parent, Emp. Menelik High School",
      testimonial:
        "This app has been a game changer for my boy in matters of academics. I can access his academic data easily and compare his performances over time. It has helped us identify areas we should focus to improve.",
    },
    {
      name: "Jelimo Birir",
      title: "Student, ALX Kenya",
      testimonial:
        "The Ra'Asis SPA web app has really made a difference in my life. With it, I can easily organize my academic work and monitor my progress over time. I am also able to get real-time help from expert tutors who use the app.",
    },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [showModal, setShowModal] = useState(false);
  const [testimonialText, setTestimonialText] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  const handleClick = (user) => {
    setSelectedUser(user);
  };

  const handleSubmit = () => {
    if (!name.trim() || !department.trim() || !testimonialText.trim()) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    console.log("New Testimonial Submitted:", {
      name,
      department,
      testimonialText,
    });
    setName("");
    setDepartment("");
    setTestimonialText("");
    setShowModal(false);
  };

  return (
    <div className={styles.testimonialsContainer}>
      <div className={styles.userDetails}>
        <h2>{selectedUser.name}</h2>
        <p>{selectedUser.title}</p>
      </div>

      <div className={styles.userTestimonials}>
        <p>{selectedUser.testimonial}</p>
        <div className={styles.testimonialButtons}>
          {users.map((user) => (
            <button
              key={user.name}
              onClick={() => handleClick(user)}
              className={selectedUser.name === user.name ? styles.active : ""}
            ></button>
          ))}
        </div>
      </div>

      {/* Authenticated users can leave a testimonial */}
      {isAuthenticated && (
        <div className={styles.LeaveTestimonialButtonContainer}>
          <button
            className={styles.leaveTestimonialButton}
            onClick={() => setShowModal(true)}
          >
            Leave a Testimonial
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2>Leave a Testimonial</h2>

            <div className={styles.titleFields}>
              <input
                type="text"
                placeholder="Enter your Names"
                className={styles.titleFieldsInputs}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Title"
                className={styles.titleFieldsInputs}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <textarea
              value={testimonialText}
              onChange={(e) => setTestimonialText(e.target.value)}
              placeholder="Write your testimonial here"
              className={styles.modalTextarea}
            />

            <div className={styles.modalActions}>
              <button className={styles.submitButton} onClick={handleSubmit}>
                Submit
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.userDetails} ${styles.userDetailsMobile}`}>
        <h2>{selectedUser.name}</h2>
        <p>{selectedUser.title}</p>
      </div>
    </div>
  );
};

export default Testimonials;
