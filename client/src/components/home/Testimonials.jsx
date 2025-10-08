import { useState } from "react";
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

  const handleClick = (user) => {
    setSelectedUser(user);
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
      {isAuthenticated && (
        <div className={styles.LeaveTestimonialButtonContainer}>
          <button className={styles.leaveTestimonialButton}>Leave Testimonial</button>
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