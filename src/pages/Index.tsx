import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LicensePlateHook from "@/components/LicensePlateHook";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <LicensePlateHook />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
