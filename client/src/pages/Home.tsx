import { Features } from "@/components/layout/Features";
import { Workflow } from "@/components/layout/Workflow";
import { HeroSection } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Stats } from "@/components/layout/Stats";
import { FAQ } from "@/components/layout/FAQ";
import { CTA } from "@/components/layout/CTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="antialiased selection:bg-indigo-100 selection:text-indigo-900 bg-slate-50 text-slate-600 font-jakarta">
        <Header />
        <HeroSection />
        <Stats />
        <Features />
        <Workflow />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
