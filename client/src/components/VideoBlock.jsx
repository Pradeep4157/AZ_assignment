import { useEffect, useState } from "react";
import { Loader2, Video, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function VideoBlock({ searchQuery, caption, lessonId }) {
  console.log("THIS IS THE LESSONiD :  ", lessonId);
  const { token, isAuthenticated } = useAuth();
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("Auth state in VideoBlock:", { isAuthenticated, token, searchQuery });
    if (!isAuthenticated || !token || !searchQuery) return;
    
    const fetchYouTubeVideo = async () => {
      try {
        setLoading(true);
        
        // 🔑 Append both query AND lessonId to your backend API call
        // Inside your VideoBlock.jsx useEffect, change the URL to:
        const url = `${import.meta.env.VITE_API_URL}/api/youtube/search?query=${encodeURIComponent(searchQuery)}&lessonId=${lessonId}`;
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        const result = await response.json();
        
        if (result.success && result.videoId) {
          setVideoId(result.videoId);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching video:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeVideo();
  }, [isAuthenticated, token, searchQuery, lessonId]); // Added lessonId as a dependency

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