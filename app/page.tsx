import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans selection:bg-zinc-800 selection:text-white">
      <TopBanner />
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
