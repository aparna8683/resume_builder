import React from "react";
import Banner from "../Components/Home/Banner";
import Hero from "../Components/Home/Hero";
import Features from "../Components/Home/Features";
import Testimonials from "../Components/Home/Testimonials";
import CallToAction from "../Components/Home/CallToAction";
import Footer from "../Components/Home/Footer";

const HOME = () => {
  return (
    <div>
      <Banner />
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HOME;
