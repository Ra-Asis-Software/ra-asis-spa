import { whyChooseReasons } from "../../data/whyChooseReasonsData.js";
import styles from "./WhyChoose.module.css";

const WhyChoose = () => {
  return (
    <div className={styles.whyChoose} id="why_choose">
      <div className={styles.whyChooseHeading}>
        <h2>Why Choose Ra'Asis Analytica</h2>
      </div>
      <div className={styles.whyChooseReasons}>
        {whyChooseReasons.map((reason) => (
          <div
            key={reason.id}
            className={`${styles.reasonBox} ${reason.className}`}
          >
            <div className={styles.reasonImageContainer}>
              <img
                src={reason.image}
                alt={reason.title}
                className={styles.reasonImage}
              />
            </div>
            <div className={styles.reasonTexts}>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChoose;
