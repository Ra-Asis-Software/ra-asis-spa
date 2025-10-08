import { useState } from "react";
import Header from "../components/layout/Header";
import Introduction from "../components/home/Introduction";
import FeaturesOverview from "../components/home/FeaturesOverview";
import WhyChoose from "../components/home/WhyChoose";
import Testimonials from "../components/home/Testimonials";
import LeadGeneration from "../components/home/LeadGeneration";
import ContactForm from "../components/home/ContactForm";
import Footer from "../components/layout/Footer";
import { useEffect } from "react";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user === logged in
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
