import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Atlas Developer Platform',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description: 'Internal developer operations platform for the Redlix ecosystem to manage tasks, clients, and real-time communication.',
    creator: {
      '@type': 'Organization',
      name: 'Redlix',
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans selection:bg-zinc-800 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBanner />
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
