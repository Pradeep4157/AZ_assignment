import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, Video, Terminal, AlertCircle } from "lucide-react";
import MCQCard from "../components/MCQCard";
import { useAuth } from "../context/AuthContext";
import VideoBlock from "../components/VideoBlock";
import LessonPDFExporter from "../components/LessonPDFExporter";

function LessonView() {
  const { token, isAuthenticated } = useAuth();
  const { lessonId } = useParams();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null); // Keep as null initially

  useEffect(() => {
    const generateLesson = async () => {
      if (!isAuthenticated || !token) {
        setLesson(null);
        setLoading(false);
        return;
      }

      let isBusy = false; // Guard variable to track status inside this execution run

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}/generate`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        const res = await response.json();
        
        if (response.status === 425) {
          isBusy = true; // Mark as busy so finally block skips turning off loader
          console.log("🎯 Engine busy. Retrying stream resolution shortly...");
          setTimeout(generateLesson, 4000); // ✨ FIXED: Recursively call the fetch function, not the whole view!
          return; 
        }

        if (res.success) {
          setLesson(res.data);
        }
      } catch (error) {
        console.error("Error while fetching lesson environment:", error);
      } finally {
        // 🚨 Only remove the loader spinner if the engine isn't actively cooking a retry loop!
        if (!isBusy) {
          setLoading(false);
        }
      }
    };

    generateLesson();
  }, [isAuthenticated, token, lessonId]);

  
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-center w-full">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">Generating micro-lessons</p>
          <p className="text-xs text-slate-500">Executing deterministic generation pipeline via Local AI...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6 w-full">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20 w-full">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400 font-medium">Pipeline fault: Please verify login credentials or course ownership flags.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 text-left pb-24">
      {/* Navigation & Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between w-full"> {/* 👈 Wrapper layout flexbox */}
          <Link
            to={-1}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
            Back to roadmap
          </Link>

          <LessonPDFExporter lesson={lesson} /> {/* 👈 Render Exporter Button here! */}
        </div>

        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
          {lesson.title}
        </h1>
      </div>

      {/* Structured Content Blocks */}
      <div className="space-y-10 w-full">
        {lesson.content && lesson.content.map((block, index) => {
          // 💡 SAFE fallback: If your AI service returns raw strings instead of blocks, render them directly as a paragraph
          if (typeof block === "string") {
            return (
              <p key={index} className="text-slate-300 leading-7 text-[15px] font-normal w-full">
                {block}
              </p>
            );
          }

          // Otherwise layout blocks natively according to schema definitions
          switch (block.type) {
            case "heading":
              return (
                <h2 key={index} className="text-xl md:text-2xl font-semibold tracking-tight text-white pt-4 border-b border-white/[0.04] pb-2 w-full">
                  {block.text}
                </h2>
              );

            case "paragraph":
              return (
                <p key={index} className="text-slate-300 leading-7 text-[15px] font-normal w-full">
                  {block.text}
                </p>
              );

            case "code":
              return (
                <div key={index} className="w-full rounded-xl overflow-hidden border border-white/[0.06] bg-[#090d16] group">
                  <div className="px-4 py-2 bg-white/[0.02] text-xs text-slate-400 border-b border-white/[0.06] flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Terminal className="h-3.5 w-3.5 text-slate-500" />
                      {block.language || "source_file"}
                    </span>
                  </div>
                  <pre className="p-5 overflow-x-auto text-xs md:text-sm text-slate-300 leading-relaxed bg-black/30">
                    <code>{block.content}</code>
                  </pre>
                </div>
              );

            case "video":
              return (
                <VideoBlock
                  key={index}
                  searchQuery={block.search_query} // Passes the AI query down
                  caption={block.caption}
                />
              );

            case "mcq":
              return <MCQCard key={index} question={block} />;

            default:
              return null;
          }
        })}
      </div>
      
    </div>
    
  );
}

export default LessonView;