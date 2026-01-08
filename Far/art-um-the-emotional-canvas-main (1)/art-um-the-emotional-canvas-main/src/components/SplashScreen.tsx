import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"letters" | "tagline" | "fade">("letters");
  
  const letters = ["A", "r", "t", "é", "u", "m"];
  
  useEffect(() => {
    const letterTimer = setTimeout(() => setPhase("tagline"), 1800);
    const taglineTimer = setTimeout(() => setPhase("fade"), 3200);
    const completeTimer = setTimeout(() => onComplete(), 4000);
    
    return () => {
      clearTimeout(letterTimer);
      clearTimeout(taglineTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {phase !== "fade" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          {/* Ambient gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background-secondary" />
          
          {/* Subtle glow effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(38 40% 60% / 0.3) 0%, transparent 70%)",
            }}
          />
          
          {/* Logo letters */}
          <div className="relative z-10 flex items-center justify-center">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ 
                  opacity: 0, 
                  y: 50,
                  filter: "blur(20px)",
                  scale: 0.5,
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="font-display text-6xl md:text-8xl font-bold text-foreground"
                style={{
                  textShadow: "0 0 40px rgba(201, 166, 107, 0.3)",
                }}
              >
                <motion.span
                  animate={{
                    color: letter === "é" 
                      ? ["hsl(220 25% 97%)", "hsl(38 40% 60%)", "hsl(220 25% 97%)"]
                      : undefined,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  {letter}
                </motion.span>
              </motion.span>
            ))}
          </div>
          
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: phase === "tagline" ? 1 : 0, 
              y: phase === "tagline" ? 0 : 20 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 mt-8 font-artist text-lg md:text-xl text-muted-foreground tracking-widest"
          >
            Where Art Breathes Emotion
          </motion.p>
          
          {/* Loading indicator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 3.5, ease: "linear" }}
            className="absolute bottom-20 h-[2px] bg-gradient-to-r from-transparent via-champagne to-transparent rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
