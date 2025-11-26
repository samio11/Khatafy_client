import React from "react";
import Hero from "./_homeComponets/Hero";
import Features from "./_homeComponets/Features";
import HowItWorks from "./_homeComponets/HowItWorks";
import CTA from "./_homeComponets/CTA";
import Footer from "./_homeComponets/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
