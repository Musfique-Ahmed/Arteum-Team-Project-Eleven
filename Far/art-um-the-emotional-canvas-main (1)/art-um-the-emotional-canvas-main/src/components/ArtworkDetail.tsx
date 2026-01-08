import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Bookmark, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artwork } from "./ArtworkCard";

interface ArtworkDetailProps {
  artwork: Artwork | null;
  onClose: () => void;
}

const ArtworkDetail = ({ artwork, onClose }: ArtworkDetailProps) => {
  if (!artwork) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
      >
        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-foreground hover:text-champagne transition-colors"
        >
          <X size={20} />
        </motion.button>

        <div className="h-full overflow-y-auto pb-24">
          {/* Artwork image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-[3/4] max-h-[60vh]"
          >
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain protected"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
            
            {/* Gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="px-6 -mt-8 relative z-10"
          >
            {/* Artist info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-champagne/30">
                <img
                  src={artwork.artistAvatar}
                  alt={artwork.artist}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-artist text-artist-name text-foreground">
                  {artwork.artist}
                </h3>
                <p className="text-caption text-muted-foreground">Digital Artist</p>
              </div>
              <Button variant="outline" size="sm" className="border-champagne/30 text-champagne hover:bg-champagne/10">
                Follow
              </Button>
            </div>

            {/* Title */}
            <h1 className="font-display text-display-lg text-foreground mb-4">
              {artwork.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-8">
              A contemplative piece exploring the intersection of dreams and reality, 
              rendered in the distinctive style that has become synonymous with digital artistry.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              <Button className="btn-champagne flex-1 py-6 rounded-xl font-semibold tracking-wide">
                Collect Artwork
              </Button>
            </div>

            {/* Interaction buttons */}
            <div className="flex items-center justify-around py-4 glass-panel rounded-xl mb-8">
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-cranberry transition-colors">
                <Heart size={22} />
                <span className="text-caption">324</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-champagne transition-colors">
                <MessageCircle size={22} />
                <span className="text-caption">{artwork.whispers}</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-sapphire transition-colors">
                <Bookmark size={22} />
                <span className="text-caption">Save</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <Share2 size={22} />
                <span className="text-caption">Share</span>
              </button>
            </div>

            {/* Whispers section */}
            <div className="mb-8">
              <h4 className="font-display text-lg text-foreground mb-4">Whispers</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-panel rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User size={14} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          This piece speaks to the soul. The colors evoke such tranquility.
                        </p>
                        <span className="text-caption text-muted-foreground mt-1 block">
                          2h ago
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArtworkDetail;
