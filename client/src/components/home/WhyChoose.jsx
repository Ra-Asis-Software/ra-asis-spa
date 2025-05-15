import { whyChooseReasons } from "../../data/whyChooseReasonsData";

const WhyChoose = () => {
  return (
    <div className="why-choose">
      <div className="why-choose-heading">
        <h2>Why Choose Ra'Asis Analytica</h2>
      </div>
      <div className="why-choose-reasons">
        {whyChooseReasons.map((reason) => (
          <div key={reason.id} className={`reason-box ${reason.className}`}>
            <div className="reason-image">
              <img src={reason.image} alt={reason.title} />
            </div>
            <div className="reason-texts">
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
