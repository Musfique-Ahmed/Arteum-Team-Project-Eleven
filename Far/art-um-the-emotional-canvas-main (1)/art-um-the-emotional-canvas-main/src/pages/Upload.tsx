import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload as UploadIcon, X, Image, Sparkles, Lock, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const emotions = [
  { id: "gold", label: "Contemplative", color: "bg-champagne" },
  { id: "crimson", label: "Passionate", color: "bg-cranberry" },
  { id: "sapphire", label: "Ethereal", color: "bg-sapphire" },
];

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("gold");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };
    checkAuth();
  }, [navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image under 10MB",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!selectedFile || !title.trim() || !user) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please add an image and title",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload image to storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("artworks")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("artworks")
        .getPublicUrl(fileName);

      // Insert artwork record
      const { error: insertError } = await supabase
        .from("artworks")
        .insert({
          artist_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          image_url: publicUrl,
          emotion: selectedEmotion,
          tags: tags.length > 0 ? tags : null,
          is_premium: isPremium,
        });

      if (insertError) throw insertError;

      toast({
        title: "Artwork uploaded!",
        description: "Your masterpiece is now live in the gallery.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <Header />

        <main className="pt-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="font-display text-display-lg text-foreground flex items-center gap-2">
              <UploadIcon className="text-champagne" size={28} />
              Upload Artwork
            </h1>
            <p className="text-muted-foreground mt-1">Share your creation with the world</p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full aspect-square object-cover"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background"
                >
                  <X size={18} />
                </button>
                {/* Dynamic watermark indicator */}
                <div className="absolute bottom-3 left-3 glass-panel px-3 py-1 rounded-full text-xs text-muted-foreground">
                  Watermark will be added
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square rounded-2xl border-2 border-dashed border-border/50 bg-background-secondary/30 flex flex-col items-center justify-center gap-4 hover:border-champagne/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Image size={28} className="text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-medium">Drag & drop or click to upload</p>
                  <p className="text-muted-foreground text-sm mt-1">PNG, JPG up to 10MB</p>
                </div>
              </button>
            )}
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">Title *</Label>
              <Input
                id="title"
                placeholder="Name your masterpiece"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell the story behind your art..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50 border-border/50 min-h-[100px]"
              />
            </div>

            {/* Emotion Tags */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Sparkles size={16} className="text-champagne" />
                Emotion
              </Label>
              <div className="flex gap-2">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.id}
                    onClick={() => setSelectedEmotion(emotion.id)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedEmotion === emotion.id
                        ? `${emotion.color} text-background`
                        : "glass-panel text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {emotion.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Tag size={16} />
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="bg-background/50 border-border/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={tags.length >= 5}
                  className="border-border/50"
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-muted text-sm text-foreground flex items-center gap-1"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Premium Toggle */}
            <div className="flex items-center justify-between p-4 glass-panel rounded-xl">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-champagne" />
                <div>
                  <p className="text-foreground font-medium">Premium Access</p>
                  <p className="text-muted-foreground text-xs">Only collectors can view</p>
                </div>
              </div>
              <button
                onClick={() => setIsPremium(!isPremium)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isPremium ? "bg-champagne" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-foreground transition-transform ${
                    isPremium ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedFile || !title.trim()}
              className="w-full btn-champagne py-6 rounded-xl text-base font-semibold"
            >
              {loading ? "Uploading..." : "Publish Artwork"}
            </Button>
          </motion.div>
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Upload;
