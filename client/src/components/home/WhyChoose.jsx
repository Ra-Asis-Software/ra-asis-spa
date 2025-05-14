import React from "react";

const WhyChoose = () => {
  return (
    <div className="why-choose">
      <div className="why-choose-heading">
        <h2>Why Choose Ra'Asis Analytica</h2>
      </div>
      <div className="why-choose-reasons">
        <div className="reason-box accessibility-reason">
          <div className="reason-image">
            <img
              src="/assets/anytime_anywhere.webp"
              alt="Access, Anytime, Anywhere"
            />
          </div>
          <div className="reason-texts">
            <h3>Access, Anytime, Anywhere</h3>
            <p>
              Experience a lighting-fast mobile-friendly system that keeps you
              connected and productive wherever you go.
            </p>
          </div>
        </div>
        <div className="reason-box setup-reason">
          <div className="reason-image">
            <img src="/assets/easy.webp" alt="Effortless Setup and Use" />
          </div>
          <div className="reason-texts">
            <h3>Effortless Setup & Use</h3>
            <p>
              Get started in minutes. No technical expertise needed. Designed
              for simplicity, tailored for results.
            </p>
          </div>
        </div>
        <div className="reason-box training-reason">
          <div className="reason-image">
            <img
              src="/assets/expert_training.webp"
              alt="Expert-Led On-Site Training"
            />
          </div>
          <div className="reason-texts">
            <h3>Expert-Led On-Site Training</h3>
            <p>
              Empowering hands-on, personalised training designed to give you
              the maximum potential of application.
            </p>
          </div>
        </div>
        <div className="reason-box support-reason">
          <div className="reason-image">
            <img
              src="/assets/expert_support.webp"
              alt="24/7 Well Equiped Support"
            />
          </div>
          <div className="reason-texts">
            <h3>24/7 Well Equiped Support</h3>
            <p>
              Count on our dedicated support team, available around the clock to
              assist you with any questions or challenges.
            </p>
          </div>
        </div>
        <div className="reason-box secure-reason">
          <div className="reason-image">
            <img src="/assets/secure_hosting.webp" alt="Secure Cloud Hosting" />
          </div>
          <div className="reason-texts">
            <h3>Secure Cloud Hosting</h3>
            <p>
              Rest easy knowing you have robust and secure cloud servers that
              protect your data from loss and ensure seamless accessibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
