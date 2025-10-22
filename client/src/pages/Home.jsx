import { useEffect, useState } from "react";
import Header from "../components/layout/Header.jsx";
import Introduction from "../components/home/Introduction.jsx";
import FeaturesOverview from "../components/home/FeaturesOverview.jsx";
import WhyChoose from "../components/home/WhyChoose.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import LeadGeneration from "../components/home/LeadGeneration.jsx";
import ContactForm from "../components/home/ContactForm.jsx";
import Footer from "../components/layout/Footer.jsx";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage for authentication token when component mounts
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
  }, []);

  return (
    <>
      <Header />
      <Introduction />
      <FeaturesOverview />
      <WhyChoose />
      <Testimonials isAuthenticated={isLoggedIn} />
      <LeadGeneration />
      <ContactForm />
      <Footer />
    </>
  );
};

export default Home;
