import { useEffect, useState } from "react";
import styles from "./Testimonials.module.css";
import { getApprovedTestimonials } from "../../services/testimonialService.js";
import TestimonialsForm from "./TestimonialsForm.jsx";
import Modal from "../ui/Modal.jsx";

const Testimonials = ({ isAuthenticated }) => {
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Static placeholder testimonials
  const staticTestimonials = [
    {
      _id: "static-1",
      name: "Allan Kimutai",
      title: "Teacher, Lugulu Girls High School",
      testimonial:
        "Ra'Asis SPA is a one-stop shop where you can manage information and reports concerning students, teachers, support staff, and parents with ease. It is fast, accessible, and reliable from any web browser or mobile phone.",
      isStatic: true,
    },
    {
      _id: "static-2",
      name: "Fridah Muthoni",
      title: "Parent, Emp. Menelik High School",
      testimonial:
        "This app has been a game changer for my boy in matters of academics. I can access his academic data easily and compare his performances over time. It has helped us identify areas we should focus to improve.",
      isStatic: true,
    },
    {
      _id: "static-3",
      name: "Jelimo Birir",
      title: "Student, ALX Kenya",
      testimonial:
        "The Ra'Asis SPA web app has really made a difference in my life. With it, I can easily organize my academic work and monitor my progress over time. I am also able to get real-time help from expert tutors who use the app.",
      isStatic: true,
    },
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      // Fetch approved testimonials
      const approvedResponse = await getApprovedTestimonials();
      let approvedData = [];

      if (!approvedResponse.error && Array.isArray(approvedResponse.data)) {
        approvedData = approvedResponse.data.map((testimonial) => ({
          ...testimonial,
          title: `${testimonial.role || "Member"}, ${
            testimonial.groupName || "Unknown Institution"
          }`,
          name:
            testimonial.name ||
            `${testimonial.user?.firstName} ${testimonial.user?.lastName}`,
        }));
      }

      setApprovedTestimonials(approvedData);
      console.log(approvedData);

      // Set initial selected user
      const allTestimonials = [...approvedData, ...staticTestimonials];
      setSelectedUser(allTestimonials[0] || staticTestimonials[0]);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setSelectedUser(staticTestimonials[0]);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayTestimonials = () => {
    const displayTestimonials = [...staticTestimonials];

    // Replace static testimonials with real ones
    approvedTestimonials.forEach((realTestimonial, index) => {
      if (index < staticTestimonials.length) {
        displayTestimonials[index] = realTestimonial;
      }
    });

    return displayTestimonials;
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    // Refresh testimonials to update user testimonial status
    fetchTestimonials();
  };

  const handleClick = (user) => {
    setSelectedUser(user);
  };

  const displayTestimonials = getDisplayTestimonials();

  if (loading) {
    return (
      <div className={styles.testimonialsContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.testimonialsContainer}>
      <div className={styles.testimonialsGrid}>
        <div className={styles.userDetails}>
          <h2>{selectedUser?.name}</h2>
          <p>{selectedUser?.title}</p>
        </div>
        <div className={styles.userTestimonials}>
          <p>{selectedUser?.testimonial}</p>
          <div className={styles.testimonialButtons}>
            {displayTestimonials.map((user) => (
              <button
                key={user._id}
                onClick={() => handleClick(user)}
                className={selectedUser._id === user._id ? styles.active : ""}
              ></button>
            ))}
          </div>
        </div>
        <div className={`${styles.userDetails} ${styles.userDetailsMobile}`}>
          <h2>{selectedUser?.name}</h2>
          <p>{selectedUser?.title}</p>
        </div>
      </div>
      {isAuthenticated && (
        <div className={styles.leaveTestimonialButtonContainer}>
          <p>
            How is your experience with Ra'Asis SPA ? If you have a moment let
            us know below
          </p>
          <button
            className={styles.leaveTestimonialButton}
            onClick={handleOpenForm}
          >
            SHARE YOUR FEEDBACK
          </button>
        </div>
      )}
      {/* Testimonial Form Modal */}
      <Modal isOpen={isFormOpen} onClose={handleCloseForm}>
        <TestimonialsForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
};

export default Testimonials;
