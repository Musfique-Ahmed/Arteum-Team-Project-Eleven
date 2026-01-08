import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, TrendingUp, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Artwork } from "@/components/ArtworkCard";

// Import sample images
import artHero from "@/assets/art-hero-1.jpg";
import artPiece1 from "@/assets/art-piece-1.jpg";
import artPiece2 from "@/assets/art-piece-2.jpg";
import artPiece3 from "@/assets/art-piece-3.jpg";
import artPiece4 from "@/assets/art-piece-4.jpg";
import artPiece5 from "@/assets/art-piece-5.jpg";
import artPiece7 from "@/assets/art-piece-7.jpg";

// Sample trending data
const trendingArtworks: (Artwork & { rank: number; impactScore: number; views: number })[] = [
  {
    id: "1",
    title: "Ethereal Dreams",
    artist: "Luna Miyazaki",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
    image: artHero,
    whispers: 1234,
    emotion: "sapphire",
    rank: 1,
    impactScore: 98,
    views: 45200,
  },
  {
    id: "2",
    title: "Sakura Dreams",
    artist: "Hana Sato",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hana",
    image: artPiece3,
    whispers: 987,
    emotion: "gold",
    rank: 2,
    impactScore: 94,
    views: 38100,
  },
  {
    id: "3",
    title: "Temple in the Clouds",
    artist: "Koji Yamamoto",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=koji",
    image: artPiece5,
    whispers: 756,
    emotion: "sapphire",
    rank: 3,
    impactScore: 91,
    views: 29800,
  },
  {
    id: "4",
    title: "Golden Flow",
    artist: "Akira Tanaka",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=akira",
    image: artPiece1,
    whispers: 654,
    emotion: "gold",
    rank: 4,
    impactScore: 87,
    views: 21500,
  },
  {
    id: "5",
    title: "Cosmic Passion",
    artist: "Rei Kojima",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rei",
    image: artPiece4,
    whispers: 543,
    emotion: "crimson",
    rank: 5,
    impactScore: 84,
    views: 18200,
  },
  {
    id: "6",
    title: "Stargazer's Dream",
    artist: "Mei Chen",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mei",
    image: artPiece7,
    whispers: 432,
    emotion: "gold",
    rank: 6,
    impactScore: 79,
    views: 15600,
  },
  {
    id: "7",
    title: "Quiet Contemplation",
    artist: "Yuki Watanabe",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki",
    image: artPiece2,
    whispers: 321,
    emotion: "crimson",
    rank: 7,
    impactScore: 75,
    views: 12400,
  },
];

const Trending = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "all">("today");

  const heroArtwork = trendingArtworks[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <Header />

        <main className="pt-4">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-6"
          >
            <h1 className="font-display text-display-lg text-foreground flex items-center gap-2">
              <TrendingUp className="text-champagne" size={28} />
              Trending
            </h1>
            <p className="text-muted-foreground mt-1">Discover what's moving the art world</p>
          </motion.div>

          {/* Time Filter Chips */}
          <div className="flex gap-2 px-4 mb-6 overflow-x-auto scrollbar-hide pb-2">
            {(["today", "week", "all"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  timeFilter === filter
                    ? "bg-champagne text-background"
                    : "glass-panel text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === "today" ? "Today" : filter === "week" ? "This Week" : "All Time"}
              </button>
            ))}
          </div>

          {/* Hero Trending Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="px-4 mb-6"
          >
            <div className="relative rounded-2xl overflow-hidden card-neumorphic">
              <img
                src={heroArtwork.image}
                alt={heroArtwork.title}
                className="w-full aspect-video object-cover"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              
              {/* Rank badge */}
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-champagne flex items-center justify-center">
                <span className="font-display text-xl font-bold text-background">#1</span>
              </div>
              
              {/* Impact Score Ring */}
              <div className="absolute top-4 right-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="hsl(var(--muted))"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="hsl(var(--accent-champagne))"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${(heroArtwork.impactScore / 100) * 176} 176`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-foreground font-bold text-sm">{heroArtwork.impactScore}</span>
                  </div>
                </div>
                <p className="text-center text-caption text-muted-foreground mt-1">Impact</p>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={heroArtwork.artistAvatar}
                    alt={heroArtwork.artist}
                    className="w-8 h-8 rounded-full border-2 border-champagne/30"
                  />
                  <span className="font-artist text-foreground">{heroArtwork.artist}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {heroArtwork.title}
                </h3>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {(heroArtwork.views / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} /> {heroArtwork.whispers}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top 10 Grid */}
          <div className="px-4">
            <h2 className="font-display text-lg text-foreground mb-4">Top 10</h2>
            <div className="space-y-3">
              {trendingArtworks.slice(1).map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="flex items-center gap-4 p-3 glass-panel rounded-xl"
                >
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-foreground">#{artwork.rank}</span>
                  </div>
                  
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-semibold text-foreground truncate">
                      {artwork.title}
                    </h3>
                    <p className="font-artist text-xs text-muted-foreground">{artwork.artist}</p>
                    <div className="flex items-center gap-3 mt-1 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <Eye size={10} /> {(artwork.views / 1000).toFixed(1)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={10} /> {artwork.whispers}
                      </span>
                    </div>
                  </div>
                  
                  {/* Impact Score */}
                  <div className="text-right">
                    <span className="text-champagne font-bold">{artwork.impactScore}</span>
                    <p className="text-caption text-muted-foreground">score</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Trending;
