import React from "react";

const ContactForm = () => {
  return (
    <div className="contact-form">
      <div className="contact-form-intro">
        <h2>Let's Connect</h2>
        <p>
          Fill out the form below to connect with our sales team and discuss how
          Ra'Asis Analytica can help your school or you as an individual.
        </p>
      </div>
      <div className="contact-form-fields">
        <form id="landing_contact_form">
          <div className="contact-names form-section">
            <div className="input-container">
              <label>
                First Name<span className="required-star">*</span>
              </label>
              <input type="text" name="firstName" size="30" />
            </div>
            <div className="input-container">
              <label>
                Last Name<span className="required-star">*</span>
              </label>
              <input type="text" name="lastName" size="30" />
            </div>
          </div>
          <div className="contact-email-phone form-section">
            <div className="input-container">
              <label>
                Email Address<span className="required-star">*</span>
              </label>
              <input type="email" name="email" size="30" />
            </div>
            <div className="input-container">
              <label>
                Phone Number<span className="required-star">*</span>
              </label>
              <input type="text" name="phoneNumber" size="30" />
            </div>
          </div>
          <div className="contact-title-school form-section">
            <div className="input-container">
              <label>
                Title<span className="required-star">*</span>
              </label>
              <input type="text" name="title" size="30" />
            </div>
            <div className="input-container">
              <label>
                School<span className="required-star">*</span>
              </label>
              <input type="text" name="school" size="30" />
            </div>
          </div>
          <div className="contact-message">
            <div className="input-container">
              <textarea
                name="message"
                placeholder="How can we be of help to you"
              ></textarea>
            </div>
          </div>
          <div className="submit-button">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
