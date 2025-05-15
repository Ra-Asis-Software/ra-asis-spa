import { Link } from "react-router-dom";
import { footerLinkContainers } from "../../data/footerLinksData";
import { footerSocials } from "../../data/footerSocialsData";

const Footer = () => {
  return (
    <footer className="landing-footer" id="landing">
      <div className="logo-name-socials">
        <div className="logo-name">
          <Link to="/">
            <img src="/assets/spa_site_icon.webp" alt="SPA logo" />
          </Link>
          <h3>Ra'Asis Analytica</h3>
        </div>
        <div className="socials">
          {footerSocials.map((footerSocial) => (
            <Link
              key={footerSocial.id}
              to={footerSocial.linkTo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={`fa-brands ${footerSocial.socialIcon}`}></i>
            </Link>
          ))}
        </div>
      </div>
      {footerLinkContainers.map((footerLinkContainer) => (
        <div
          key={footerLinkContainer.id}
          className={`${footerLinkContainer.className} footer-links`}
        >
          <h3>{footerLinkContainer.containerHeading}</h3>
          {footerLinkContainer.containerLinks.map((containerLink) => (
            <Link to={containerLink.linkTo}>{containerLink.linkText}</Link>
          ))}
        </div>
      ))}
    </footer>
  );
};

export default Footer;
