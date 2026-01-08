import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistAvatar: string;
  image: string;
  whispers: number;
  emotion: "gold" | "crimson" | "sapphire";
  aspectRatio?: "portrait" | "landscape" | "square";
}

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
  onClick: (artwork: Artwork) => void;
}

const emotionColors = {
  gold: "bg-champagne/20 border-champagne/30",
  crimson: "bg-cranberry/20 border-cranberry/30",
  sapphire: "bg-sapphire/20 border-sapphire/30",
};

const emotionDots = {
  gold: "bg-champagne",
  crimson: "bg-cranberry",
  sapphire: "bg-sapphire",
};

const ArtworkCard = ({ artwork, index, onClick }: ArtworkCardProps) => {
  const getHeight = () => {
    switch (artwork.aspectRatio) {
      case "portrait": return "h-80";
      case "landscape": return "h-44";
      case "square": return "h-56";
      default: return index % 3 === 0 ? "h-72" : index % 2 === 0 ? "h-56" : "h-64";
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(artwork)}
      className="group cursor-pointer"
    >
      <div className={`relative ${getHeight()} rounded-card overflow-hidden card-neumorphic`}>
        {/* Image */}
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 protected"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Artist avatar */}
        <div className="absolute top-3 left-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-background/50 shadow-lg">
            <img 
              src={artwork.artistAvatar} 
              alt={artwork.artist}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Emotion indicator */}
        <div className="absolute top-3 right-3">
          <div className={`w-3 h-3 rounded-full ${emotionDots[artwork.emotion]} shadow-glow`} />
        </div>
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1">
            {artwork.title}
          </h3>
          <p className="font-artist text-xs text-muted-foreground mt-1">
            {artwork.artist}
          </p>
          
          {/* Whispers count */}
          <div className="flex items-center gap-1 mt-2">
            <MessageCircle size={12} className="text-muted-foreground" />
            <span className="text-caption text-muted-foreground">
              {artwork.whispers} whispers
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ArtworkCard;
