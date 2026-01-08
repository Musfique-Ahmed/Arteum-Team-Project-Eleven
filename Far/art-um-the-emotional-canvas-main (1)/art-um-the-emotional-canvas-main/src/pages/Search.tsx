import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, X, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import MasonryGrid from "@/components/MasonryGrid";
import ArtworkDetail from "@/components/ArtworkDetail";
import { Artwork } from "@/components/ArtworkCard";

// Import sample images
import artHero from "@/assets/art-hero-1.jpg";
import artPiece1 from "@/assets/art-piece-1.jpg";
import artPiece2 from "@/assets/art-piece-2.jpg";
import artPiece3 from "@/assets/art-piece-3.jpg";
import artPiece4 from "@/assets/art-piece-4.jpg";
import artPiece5 from "@/assets/art-piece-5.jpg";
import artPiece7 from "@/assets/art-piece-7.jpg";

const allArtworks: Artwork[] = [
  {
    id: "1",
    title: "Ethereal Dreams",
    artist: "Luna Miyazaki",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
    image: artHero,
    whispers: 234,
    emotion: "sapphire",
  },
  {
    id: "2",
    title: "Golden Flow",
    artist: "Akira Tanaka",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=akira",
    image: artPiece1,
    whispers: 156,
    emotion: "gold",
  },
  {
    id: "3",
    title: "Quiet Contemplation",
    artist: "Yuki Watanabe",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki",
    image: artPiece2,
    whispers: 89,
    emotion: "crimson",
  },
  {
    id: "4",
    title: "Sakura Dreams",
    artist: "Hana Sato",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hana",
    image: artPiece3,
    whispers: 312,
    emotion: "gold",
  },
  {
    id: "5",
    title: "Cosmic Passion",
    artist: "Rei Kojima",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rei",
    image: artPiece4,
    whispers: 178,
    emotion: "crimson",
  },
  {
    id: "6",
    title: "Temple in the Clouds",
    artist: "Koji Yamamoto",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=koji",
    image: artPiece5,
    whispers: 267,
    emotion: "sapphire",
  },
  {
    id: "7",
    title: "Stargazer's Dream",
    artist: "Mei Chen",
    artistAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mei",
    image: artPiece7,
    whispers: 145,
    emotion: "gold",
  },
];

const trendingSearches = ["Ghibli style", "Abstract", "Portraits", "Landscapes", "Anime"];
const recentSearches = ["Luna Miyazaki", "Golden hour", "Watercolor"];

const Search = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = allArtworks.filter(
          (artwork) =>
            artwork.title.toLowerCase().includes(query.toLowerCase()) ||
            artwork.artist.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        {/* Search Header */}
        <div className="sticky top-0 z-30 glass-panel border-b border-border/30 p-4">
          <div className="relative">
            <SearchIcon
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Search artworks, artists..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground rounded-xl"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <main className="pt-4">
          {!query ? (
            // Empty state with suggestions
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4"
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-muted-foreground" />
                    <h3 className="font-display text-foreground">Recent</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="px-4 py-2 glass-panel rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-champagne" />
                  <h3 className="font-display text-foreground">Trending</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setQuery(search)}
                      className="px-4 py-2 glass-panel rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discover */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-champagne" />
                  <h3 className="font-display text-foreground">Discover</h3>
                </div>
                <MasonryGrid
                  artworks={allArtworks.slice(0, 4)}
                  onArtworkClick={setSelectedArtwork}
                />
              </div>
            </motion.div>
          ) : (
            // Search Results
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4"
            >
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <>
                  <p className="text-muted-foreground text-sm mb-4">
                    {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
                  </p>
                  <MasonryGrid artworks={results} onArtworkClick={setSelectedArtwork} />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Try different keywords or browse trending artworks
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {selectedArtwork && (
        <ArtworkDetail artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </div>
  );
};

export default Search;
