import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Check, Heart, MessageCircle, UserPlus, ShoppingBag, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface Notification {
  id: string;
  type: "follow" | "like" | "whisper" | "collect" | "system";
  title: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
}

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "follow",
    title: "Luna Miyazaki started following you",
    isRead: false,
    createdAt: "2h ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
  },
  {
    id: "2",
    type: "like",
    title: "Akira Tanaka loved your artwork",
    message: '"Golden Flow" received 50 new likes!',
    isRead: false,
    createdAt: "4h ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=akira",
  },
  {
    id: "3",
    type: "whisper",
    title: "New whisper on your artwork",
    message: '"This piece speaks to my soul..."',
    isRead: true,
    createdAt: "1d ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yuki",
  },
  {
    id: "4",
    type: "collect",
    title: "Your artwork was collected!",
    message: '"Ethereal Dreams" sold for 2.5 ETH',
    isRead: true,
    createdAt: "2d ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hana",
  },
  {
    id: "5",
    type: "system",
    title: "Welcome to Artéum!",
    message: "Start by exploring the gallery and following artists you love.",
    isRead: true,
    createdAt: "3d ago",
  },
];

const notificationIcons = {
  follow: UserPlus,
  like: Heart,
  whisper: MessageCircle,
  collect: ShoppingBag,
  system: Info,
};

const notificationColors = {
  follow: "text-sapphire bg-sapphire/20",
  like: "text-cranberry bg-cranberry/20",
  whisper: "text-champagne bg-champagne/20",
  collect: "text-champagne bg-champagne/20",
  system: "text-muted-foreground bg-muted",
};

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <Header />

        <main className="pt-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="text-champagne" size={24} />
                <h1 className="font-display text-display-lg text-foreground">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-cranberry text-foreground rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-sm text-champagne"
                >
                  <Check size={16} />
                  Mark all read
                </button>
              )}
            </div>
          </motion.div>

          {/* Notifications List */}
          <div className="px-4 space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notificationIcons[notification.type];
              const colorClass = notificationColors[notification.type];

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl glass-panel ${
                    !notification.isRead ? "border-l-2 border-champagne" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon or Avatar */}
                    {notification.avatar ? (
                      <img
                        src={notification.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon size={18} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.isRead ? "text-muted-foreground" : "text-foreground"}`}>
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {notification.createdAt}
                      </span>
                    </div>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-champagne flex-shrink-0 mt-2" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-12 px-4">
              <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                When someone interacts with your art, you'll see it here
              </p>
            </div>
          )}
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Notifications;
