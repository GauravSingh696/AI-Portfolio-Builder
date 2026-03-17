import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
