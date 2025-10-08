import { useEffect, useState } from "react";
import styles from "./Testimonials.module.css";
import TestimonialForm from "../dashboard/TestimonialsForm";
import { getApprovedTestimonials } from "../../services/testimonialService";

const Testimonials = ({ isAuthenticated }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    name: "",
    title: "",
    testimonial: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      const fetchedTestimonials = await getApprovedTestimonials();

      if (!fetchedTestimonials.error) {
        const testimonialOne = fetchedTestimonials.data?.[0];
        setUsers(fetchedTestimonials.data);
        setSelectedUser({
          name: testimonialOne.name ?? "",
          title: testimonialOne.title ?? "",
          testimonial: testimonialOne.testimonial ?? "",
        });
      }
    }
    fetchDetails();
  }, []);

  const handleClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className={styles.testimonialsContainer}>
      {users.length > 0 && (
        <>
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
                  className={
                    selectedUser.name === user.name ? styles.active : ""
                  }
                ></button>
              ))}
            </div>
          </div>
        </>
      )}

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

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TestimonialForm {...{ showModal, setShowModal }} />
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
