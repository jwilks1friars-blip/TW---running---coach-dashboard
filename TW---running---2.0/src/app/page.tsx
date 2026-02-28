import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
