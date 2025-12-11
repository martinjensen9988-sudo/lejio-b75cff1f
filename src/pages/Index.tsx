import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Engines from "@/components/Engines";
import Architecture from "@/components/Architecture";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Engines />
      <Architecture />
      <Roadmap />
      <Footer />
    </main>
  );
};

export default Index;
