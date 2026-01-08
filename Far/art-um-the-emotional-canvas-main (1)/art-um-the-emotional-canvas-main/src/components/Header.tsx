import { motion } from "framer-motion";
import { Bell, Search, Home, Compass, PlusCircle, Users, User, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const desktopNavItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Compass, label: "Discover", path: "/discover" },
  { icon: TrendingUp, label: "Trending", path: "/trending" },
  { icon: Users, label: "Network", path: "/" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 glass-panel border-b border-border/30"
    >
      <div className="flex items-center justify-between px-4 py-4 lg:py-5 lg:px-0">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <span className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Art<span className="text-champagne">é</span>um
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {desktopNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "text-champagne bg-champagne/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          {/* Upload button - desktop only */}
          <button 
            onClick={() => navigate("/upload")}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-champagne text-background font-medium hover:bg-champagne/90 transition-colors"
          >
            <PlusCircle size={18} />
            <span className="text-sm">Upload</span>
          </button>

          <button 
            onClick={() => navigate("/search")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cranberry" />
          </button>
          
          {/* Profile button - desktop only */}
          <button 
            onClick={() => navigate("/profile")}
            className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
