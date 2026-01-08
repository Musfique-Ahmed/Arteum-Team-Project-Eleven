import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Settings, LogOut, Edit2, Image, Heart, Users, Grid3X3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

// Import sample images
import artPiece1 from "@/assets/art-piece-1.jpg";
import artPiece3 from "@/assets/art-piece-3.jpg";
import artPiece5 from "@/assets/art-piece-5.jpg";
import artPiece7 from "@/assets/art-piece-7.jpg";

const sampleGallery = [artPiece1, artPiece3, artPiece5, artPiece7];

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [contentTab, setContentTab] = useState<"gallery" | "collections" | "liked">("gallery");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Artist";

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <Header />

        <main>
          {/* Cover & Avatar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Cover gradient */}
            <div className="h-32 bg-gradient-to-b from-champagne/20 to-background" />
            
            {/* Avatar */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-muted">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-champagne/20 to-sapphire/20">
                    <User size={32} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              {profile?.is_verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-champagne flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pt-16 px-4 text-center"
          >
            <h1 className="font-display text-xl font-bold text-foreground">
              {displayName}
            </h1>
            {profile?.username && (
              <p className="text-muted-foreground text-sm">@{profile.username}</p>
            )}
            {profile?.bio && (
              <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="font-display text-xl font-bold text-foreground">
                  {profile?.artworks_count || 0}
                </p>
                <p className="text-muted-foreground text-xs">Artworks</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold text-foreground">
                  {profile?.followers_count || 0}
                </p>
                <p className="text-muted-foreground text-xs">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold text-foreground">
                  {profile?.following_count || 0}
                </p>
                <p className="text-muted-foreground text-xs">Following</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                className="border-champagne/30 text-champagne hover:bg-champagne/10"
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>

          {/* Content Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 border-t border-border/30"
          >
            <div className="flex">
              {([
                { id: "gallery", icon: Grid3X3, label: "Gallery" },
                { id: "collections", icon: Image, label: "Collections" },
                { id: "liked", icon: Heart, label: "Liked" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setContentTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 border-b-2 transition-colors ${
                    contentTab === tab.id
                      ? "border-champagne text-champagne"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="p-4">
              {contentTab === "gallery" && (
                <div className="grid grid-cols-2 gap-2">
                  {sampleGallery.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              )}
              {contentTab === "collections" && (
                <div className="text-center py-12 text-muted-foreground">
                  <Image size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No collections yet</p>
                </div>
              )}
              {contentTab === "liked" && (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No liked artworks yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Profile;
