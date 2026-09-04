import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { ProgramCards } from "@/components/sections/program-cards";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { CredentialsTeaser } from "@/components/sections/credentials-teaser";
import { FaqTeaser } from "@/components/sections/faq-teaser";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProgramCards />
      <HowItWorks />
      <Testimonials />
      <CredentialsTeaser />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}