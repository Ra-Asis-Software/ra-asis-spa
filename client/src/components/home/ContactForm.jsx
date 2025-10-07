import styles from "./ContactForm.module.css";

const ContactForm = () => {
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
        <form className={styles.landingContactForm}>
          <div className={`${styles.contactNames} ${styles.formSection}`}>
            <div className={styles.inputContainer}>
              <label>
                First Name<span className={styles.requiredStar}>*</span>
              </label>
              <input type="text" name="firstName" size="30" />
            </div>
            <div className={styles.inputContainer}>
              <label>
                Last Name<span className={styles.requiredStar}>*</span>
              </label>
              <input type="text" name="lastName" size="30" />
            </div>
          </div>
          <div className={`${styles.contactEmailPhone} ${styles.formSection}`}>
            <div className={styles.inputContainer}>
              <label>
                Email Address<span className={styles.requiredStar}>*</span>
              </label>
              <input type="email" name="email" size="30" />
            </div>
            <div className={styles.inputContainer}>
              <label>
                Phone Number<span className={styles.requiredStar}>*</span>
              </label>
              <input type="text" name="phoneNumber" size="30" />
            </div>
          </div>
          <div className={`${styles.contactTitleSchool} ${styles.formSection}`}>
            <div className={styles.inputContainer}>
              <label>
                Title<span className={styles.requiredStar}>*</span>
              </label>
              <input type="text" name="title" size="30" />
            </div>
            <div className={styles.inputContainer}>
              <label>
                School/Group<span className={styles.requiredStar}>*</span>
              </label>
              <input type="text" name="school" size="30" />
            </div>
          </div>
          <div className={styles.contactMessage}>
            <div className={styles.inputContainer}>
              <textarea
                name="message"
                placeholder="How can we be of help to you"
              ></textarea>
            </div>
          </div>
          <div className={styles.submitButtonContainer}>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
