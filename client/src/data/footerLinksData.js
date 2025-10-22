import styles from "../components/layout/Footer.module.css";

// Footer links containers data
export const footerLinkContainers = [
  {
    id: 1,
    containerHeading: "What We Offer",
    containerLinks: [
      {
        linkText: "Intuitive Dashboards",
        linkTo: "#",
      },
      {
        linkText: "Student Analytics",
        linkTo: "#",
      },
      {
        linkText: "Progress Reports",
        linkTo: "#",
      },
      {
        linkText: "Notifications",
        linkTo: "#",
      },
      {
        linkText: "Reminders",
        linkTo: "#",
      },
    ],
    className: styles.whatWeOffer,
  },
  {
    id: 2,
    containerHeading: "Company",
    containerLinks: [
      {
        linkText: "Become A Partner",
        linkTo: "#",
      },
      {
        linkText: "Our Partners",
        linkTo: "#",
      },
    ],
    className: styles.company,
  },
  {
    id: 3,
    containerHeading: "Popular Links",
    containerLinks: [
      {
        linkText: "Resources",
        linkTo: "/dashboard",
      },
      {
        linkText: "Register",
        linkTo: "/register",
      },
      {
        linkText: "Login",
        linkTo: "/login",
      },
    ],
    className: styles.popularLinks,
  },
];
