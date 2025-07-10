import Header from "../components/layout/Header";
import Introduction from "../components/home/Introduction";
import FeaturesOverview from "../components/home/FeaturesOverview";
import WhyChoose from "../components/home/WhyChoose";
import Testimonials from "../components/home/Testimonials";
import LeadGeneration from "../components/home/LeadGeneration";
import ContactForm from "../components/home/ContactForm";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Introduction />
      <FeaturesOverview />
      <WhyChoose />
      <Testimonials />
      <LeadGeneration />
      <ContactForm />
      <Footer />
    </>
  );
};

export default Home;
