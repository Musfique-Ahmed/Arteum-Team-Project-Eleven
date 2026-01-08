import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import MasonryGrid from "@/components/MasonryGrid";
import ArtworkDetail from "@/components/ArtworkDetail";
import { Artwork } from "@/components/ArtworkCard";
import { motion } from "framer-motion";

// Import artwork images
import artHero from "@/assets/art-hero-1.jpg";
import artPiece1 from "@/assets/art-piece-1.jpg";
import artPiece2 from "@/assets/art-piece-2.jpg";
import artPiece3 from "@/assets/art-piece-3.jpg";
import artPiece4 from "@/assets/art-piece-4.jpg";
import artPiece5 from "@/assets/art-piece-5.jpg";
import artPiece7 from "@/assets/art-piece-7.jpg";

// Sample artwork data
const sampleArtworks: Artwork[] = [
  {
    id: "1",
    title: "Ethereal Dreams",
    artist: "Luna Miyazaki",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
    image: artHero,
    whispers: 234,
    emotion: "sapphire",
    aspectRatio: "landscape",
  },
  {
    id: "2",
    title: "Golden Flow",
    artist: "Akira Tanaka",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=akira",
    image: artPiece1,
    whispers: 156,
    emotion: "gold",
    aspectRatio: "portrait",
  },
  {
    id: "3",
    title: "Quiet Contemplation",
    artist: "Yuki Watanabe",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki",
    image: artPiece2,
    whispers: 89,
    emotion: "crimson",
    aspectRatio: "portrait",
  },
  {
    id: "4",
    title: "Sakura Dreams",
    artist: "Hana Sato",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hana",
    image: artPiece3,
    whispers: 312,
    emotion: "gold",
    aspectRatio: "landscape",
  },
  {
    id: "5",
    title: "Cosmic Passion",
    artist: "Rei Kojima",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rei",
    image: artPiece4,
    whispers: 178,
    emotion: "crimson",
    aspectRatio: "portrait",
  },
  {
    id: "6",
    title: "Temple in the Clouds",
    artist: "Koji Yamamoto",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=koji",
    image: artPiece5,
    whispers: 267,
    emotion: "sapphire",
    aspectRatio: "landscape",
  },
  {
    id: "7",
    title: "Stargazer's Dream",
    artist: "Mei Chen",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mei",
    image: artPiece7,
    whispers: 145,
    emotion: "gold",
    aspectRatio: "portrait",
  },
];

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleArtworkClick = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedArtwork(null);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <div className="max-w-md mx-auto lg:max-w-none lg:px-6 xl:px-12 2xl:px-16">
        <Header />
      
      <main className="pt-4 lg:pt-8">
        {/* Featured section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 mb-6 lg:px-0 lg:mb-8"
        >
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="font-display text-display-md lg:text-3xl text-foreground">
              For You
            </h2>
            <button className="text-sm lg:text-base text-champagne font-medium hover:underline">
              See all
            </button>
          </div>
          
          {/* Emotion filter chips */}
          <div className="flex gap-2 lg:gap-3 mb-4 lg:mb-6 overflow-x-auto scrollbar-hide pb-2">
            {["All", "Contemplative", "Passionate", "Ethereal", "Abstract"].map((filter, i) => (
              <button
                key={filter}
                className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-300 ${
                  i === 0
                    ? "bg-champagne text-background"
                    : "glass-panel text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Masonry grid */}
        <MasonryGrid 
          artworks={sampleArtworks} 
          onArtworkClick={handleArtworkClick}
        />
      </main>
      </div>

      {/* Bottom navigation - hidden on desktop */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Artwork detail modal */}
      {selectedArtwork && (
        <ArtworkDetail 
          artwork={selectedArtwork} 
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default Index;
