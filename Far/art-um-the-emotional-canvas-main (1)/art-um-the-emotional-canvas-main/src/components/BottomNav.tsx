import { Home, Compass, PlusCircle, Users, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  { icon: Compass, label: "Discover", id: "discover", path: "/discover" },
  { icon: PlusCircle, label: "Upload", id: "upload", path: "/upload", isArtist: true },
  { icon: Users, label: "Network", id: "network", path: "/" },
  { icon: User, label: "Profile", id: "profile", path: "/profile" },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navigate = useNavigate();

  const handleNavClick = (item: typeof navItems[0]) => {
    onTabChange(item.id);
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-border/50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors duration-300 ${
                isActive 
                  ? "text-champagne" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-champagne/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {item.isArtist ? (
                <div className="relative">
                  <Icon size={24} className={isActive ? "text-champagne" : "text-champagne/70"} />
                  <div className="absolute inset-0 bg-champagne/20 rounded-full blur-md -z-10" />
                </div>
              ) : (
                <Icon size={22} />
              )}
              
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
