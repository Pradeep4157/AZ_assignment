import { useEffect, useState } from "react";
import { Loader2, Video, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function VideoBlock({ searchQuery, caption }) {
  const { token, isAuthenticated } = useAuth();
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchYouTubeVideo = async () => {
      if (!isAuthenticated || !token || !searchQuery) return;

      try {
        setLoading(true);
        setError(false);
        
        // Hit our newly protected proxy route!
        const response = await fetch(`http://localhost:5000/api/youtube/search?query=${encodeURIComponent(searchQuery)}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success && data.videoId) {
          setVideoId(data.videoId);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch streaming pipeline resource:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeVideo();
  }, [searchQuery, token, isAuthenticated]);

  if (loading) {
    return (
      <div className="w-full h-48 rounded-xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        <p className="text-xs text-slate-500">Resolving video stream index...</p>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className="w-full rounded-xl border border-red-500/10 bg-red-500/[0.02] p-5 flex items-start gap-4">
        <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-red-400">Stream Broken</h3>
          <p className="text-xs text-slate-500">Could not pull a matching video reference for query: "{searchQuery}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-4 flex flex-col gap-y-4">
        {/* 🔼 Scaled up, bold caption typography */}
        {caption && (
        <div className="flex items-center gap-2.5 text-lg md:text-xl font-bold tracking-tight text-white px-0.5">
            <Video className="h-5 w-5 text-cyan-400 shrink-0" />
            <span className="not-italic">{caption}</span>
        </div>
        )}
        
        {/* Aspect-ratio wrapper with plenty of breathing space */}
        <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-black shadow-xl">
        <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
        ></iframe>
        </div>
    </div>
    );
}

export default VideoBlock;