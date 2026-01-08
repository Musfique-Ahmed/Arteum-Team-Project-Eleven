import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

// Import artwork images for node thumbnails
import artHero from "@/assets/art-hero-1.jpg";
import artPiece1 from "@/assets/art-piece-1.jpg";
import artPiece2 from "@/assets/art-piece-2.jpg";
import artPiece3 from "@/assets/art-piece-3.jpg";
import artPiece4 from "@/assets/art-piece-4.jpg";
import artPiece5 from "@/assets/art-piece-5.jpg";
import artPiece7 from "@/assets/art-piece-7.jpg";

interface NetworkNode {
  id: string;
  name: string;
  type: "artwork" | "artist" | "emotion";
  image?: string;
  val?: number;
  color?: string;
  x?: number;
  y?: number;
}

interface NetworkLink {
  source: string;
  target: string;
  type: "created" | "emotion" | "similar" | "inspired";
  strength?: number;
}

interface GraphData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

// Color palette for different node types and emotions
const nodeColors = {
  artwork: "hsl(45, 100%, 51%)", // champagne/gold
  artist: "hsl(217, 91%, 60%)", // sapphire
  emotion: "hsl(348, 83%, 47%)", // crimson
};

const emotionColors: Record<string, string> = {
  gold: "hsl(45, 100%, 51%)",
  sapphire: "hsl(217, 91%, 60%)",
  crimson: "hsl(348, 83%, 47%)",
  contemplative: "hsl(270, 60%, 50%)",
  passionate: "hsl(348, 83%, 47%)",
  ethereal: "hsl(200, 80%, 60%)",
};

const linkColors: Record<string, string> = {
  created: "rgba(251, 191, 36, 0.4)",
  emotion: "rgba(99, 102, 241, 0.4)",
  similar: "rgba(156, 163, 175, 0.3)",
  inspired: "rgba(236, 72, 153, 0.4)",
};

// Sample network data
const generateNetworkData = (): GraphData => {
  const artworks = [
    { id: "art1", name: "Ethereal Dreams", image: artHero, emotion: "sapphire", artist: "Luna Miyazaki" },
    { id: "art2", name: "Golden Flow", image: artPiece1, emotion: "gold", artist: "Akira Tanaka" },
    { id: "art3", name: "Quiet Contemplation", image: artPiece2, emotion: "crimson", artist: "Yuki Watanabe" },
    { id: "art4", name: "Sakura Dreams", image: artPiece3, emotion: "gold", artist: "Hana Sato" },
    { id: "art5", name: "Cosmic Passion", image: artPiece4, emotion: "crimson", artist: "Rei Kojima" },
    { id: "art6", name: "Temple in the Clouds", image: artPiece5, emotion: "sapphire", artist: "Koji Yamamoto" },
    { id: "art7", name: "Stargazer's Dream", image: artPiece7, emotion: "gold", artist: "Mei Chen" },
  ];

  const artists = [
    { id: "artist1", name: "Luna Miyazaki" },
    { id: "artist2", name: "Akira Tanaka" },
    { id: "artist3", name: "Yuki Watanabe" },
    { id: "artist4", name: "Hana Sato" },
    { id: "artist5", name: "Rei Kojima" },
    { id: "artist6", name: "Koji Yamamoto" },
    { id: "artist7", name: "Mei Chen" },
  ];

  const emotions = [
    { id: "emotion_gold", name: "Gold", color: emotionColors.gold },
    { id: "emotion_sapphire", name: "Sapphire", color: emotionColors.sapphire },
    { id: "emotion_crimson", name: "Crimson", color: emotionColors.crimson },
  ];

  const nodes: NetworkNode[] = [
    ...artworks.map((a) => ({
      id: a.id,
      name: a.name,
      type: "artwork" as const,
      image: a.image,
      val: 15,
      color: emotionColors[a.emotion] || nodeColors.artwork,
    })),
    ...artists.map((a) => ({
      id: a.id,
      name: a.name,
      type: "artist" as const,
      val: 10,
      color: nodeColors.artist,
    })),
    ...emotions.map((e) => ({
      id: e.id,
      name: e.name,
      type: "emotion" as const,
      val: 20,
      color: e.color,
    })),
  ];

  const artistMap: Record<string, string> = {
    "Luna Miyazaki": "artist1",
    "Akira Tanaka": "artist2",
    "Yuki Watanabe": "artist3",
    "Hana Sato": "artist4",
    "Rei Kojima": "artist5",
    "Koji Yamamoto": "artist6",
    "Mei Chen": "artist7",
  };

  const links: NetworkLink[] = [
    // Artist to artwork connections
    ...artworks.map((a) => ({
      source: artistMap[a.artist],
      target: a.id,
      type: "created" as const,
      strength: 1,
    })),
    // Artwork to emotion connections
    ...artworks.map((a) => ({
      source: a.id,
      target: `emotion_${a.emotion}`,
      type: "emotion" as const,
      strength: 0.5,
    })),
    // Similar artworks (same emotion)
    { source: "art1", target: "art6", type: "similar" as const, strength: 0.3 },
    { source: "art2", target: "art4", type: "similar" as const, strength: 0.3 },
    { source: "art2", target: "art7", type: "similar" as const, strength: 0.3 },
    { source: "art3", target: "art5", type: "similar" as const, strength: 0.3 },
    // Inspired by connections
    { source: "art4", target: "art1", type: "inspired" as const, strength: 0.4 },
    { source: "art7", target: "art2", type: "inspired" as const, strength: 0.4 },
  ];

  return { nodes, links };
};

const Network = () => {
  const navigate = useNavigate();
  const graphRef = useRef<ForceGraphMethods>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData] = useState<GraphData>(generateNetworkData);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showLegend, setShowLegend] = useState(false);
  const [activeTab, setActiveTab] = useState("network");

  // Image cache for artwork nodes
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    // Preload images
    graphData.nodes.forEach((node) => {
      if (node.image && !imageCache.current.has(node.id)) {
        const img = new Image();
        img.src = node.image;
        img.onload = () => {
          imageCache.current.set(node.id, img);
        };
      }
    });
  }, [graphData.nodes]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNodeClick = useCallback((node: NetworkNode) => {
    setSelectedNode(node);
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 500);
      graphRef.current.zoom(2, 500);
    }
  }, []);

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.5, 300);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.5, 300);
    }
  };

  const handleReset = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 50);
    }
    setSelectedNode(null);
  };

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.name;
      const fontSize = 12 / globalScale;
      const nodeSize = node.val || 10;

      if (node.type === "artwork" && imageCache.current.has(node.id)) {
        const img = imageCache.current.get(node.id)!;
        const size = nodeSize * 2;

        // Draw circular clipped image
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
        ctx.restore();

        // Draw border
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2 + 1, 0, 2 * Math.PI);
        ctx.strokeStyle = node.color || nodeColors.artwork;
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
      } else {
        // Draw colored circle for non-artwork nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);

        if (node.type === "emotion") {
          // Gradient for emotion nodes
          const gradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            nodeSize
          );
          gradient.addColorStop(0, node.color || nodeColors.emotion);
          gradient.addColorStop(1, "rgba(0,0,0,0.3)");
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = node.color || nodeColors.artist;
        }
        ctx.fill();

        // Glow effect
        ctx.shadowColor = node.color || nodeColors.artist;
        ctx.shadowBlur = 10 / globalScale;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw label
      if (globalScale > 0.8) {
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText(label, node.x, node.y + nodeSize + 4);
      }
    },
    []
  );

  const linkCanvasObject = useCallback(
    (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const start = link.source;
      const end = link.target;

      if (typeof start !== "object" || typeof end !== "object") return;

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = linkColors[link.type as keyof typeof linkColors] || linkColors.similar;
      ctx.lineWidth = (link.strength || 0.5) * 2 / globalScale;

      if (link.type === "inspired") {
        ctx.setLineDash([5 / globalScale, 5 / globalScale]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    },
    []
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-lg text-foreground">Invisible Network</h1>
              <p className="text-xs text-muted-foreground">Discover hidden connections</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLegend(!showLegend)}
            className="text-foreground"
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Graph Container */}
      <div ref={containerRef} className="fixed inset-0 pt-16 pb-20 lg:pb-0">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="transparent"
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          onNodeClick={handleNodeClick}
          nodePointerAreaPaint={(node: any, color, ctx) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val || 10, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.005}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          warmupTicks={100}
          cooldownTicks={100}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />

        {/* Controls */}
        <div className="absolute bottom-24 lg:bottom-8 right-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            className="glass-panel"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            className="glass-panel"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleReset}
            className="glass-panel"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-20 left-4 glass-panel rounded-xl p-4 z-40 max-w-xs"
          >
            <h3 className="font-display text-sm text-foreground mb-3">Legend</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Nodes</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-champagne bg-muted" />
                    <span className="text-xs text-foreground">Artwork</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(217,91%,60%)]" />
                    <span className="text-xs text-foreground">Artist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-champagne to-crimson" />
                    <span className="text-xs text-foreground">Emotion</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Connections</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-champagne/60" />
                    <span className="text-xs text-foreground">Created by</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-indigo-500/60" />
                    <span className="text-xs text-foreground">Shares emotion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-gray-400/40" />
                    <span className="text-xs text-foreground">Similar style</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 border-t border-dashed border-pink-500/60" />
                    <span className="text-xs text-foreground">Inspired by</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Node Info */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 lg:bottom-8 left-4 right-20 glass-panel rounded-xl p-4 z-40"
          >
            <div className="flex items-center gap-3">
              {selectedNode.image ? (
                <img
                  src={selectedNode.image}
                  alt={selectedNode.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  <span className="text-white text-lg font-bold">
                    {selectedNode.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base text-foreground truncate">
                  {selectedNode.name}
                </h3>
                <p className="text-xs text-muted-foreground capitalize">
                  {selectedNode.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground"
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Network;
