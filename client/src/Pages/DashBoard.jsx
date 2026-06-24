import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Layers, Terminal, Sparkles, Loader2, ArrowRight } from "lucide-react";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Prompt State
  const [topic, setTopic] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/courses");
      const result = await response.json();
      if (result.success) setCourses(result.data);
    } catch (error) {
      console.error("Error fetching dashboard registry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setGenLoading(true);
      setStatusText("Initializing structural pipelines...");
      
      const response = await fetch("http://localhost:5000/api/courses/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, creator: "system_admin" }),
      });
      
      const result = await response.json();
      if (result.success) {
        setTopic("");
        setStatusText("");
        fetchCourses(); // Refresh list instantly
      }
    } catch (error) {
      console.error("Pipeline failure:", error);
      setStatusText("Generation cycle faulted.");
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="space-y-16 text-left">
      {/* Hero Header Block */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs ">
          <Terminal className="h-3.5 w-3.5" /> Engine Used: Local Gemma3
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            AI-Powered Course Generation.
        </h1>
        
        <p className="text-base text-slate-400 leading-relaxed">
          From a single prompt to a complete learning roadmap—modules, lessons, and progression included.
        </p>
      </div>

      {/* Control Input Panel Deck */}
      <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl relative overflow-hidden group">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-xs  uppercase tracking-wider text-slate-400">Enter Course Name</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                disabled={genLoading}
                placeholder="e.g., Event-Driven Microservices Architecture with Kafka" 
                className="flex-1 bg-black/40 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              <button 
                type="submit"
                disabled={genLoading || !topic.trim()}
                className="h-10 px-5 rounded-lg bg-white text-black font-medium text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-30 whitespace-nowrap shadow-md"
              >
                {genLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-emerald-600 fill-emerald-600/20" />
                    Generate Course
                  </>
                )}
              </button>
            </div>
          </div>
          {statusText && (
            <p className="text-xs  text-cyan-400 animate-pulse">&gt; {statusText}</p>
          )}
        </form>
      </div>

      {/* Registry Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2 m-0">
            <Layers className="h-4 w-4 text-slate-400" /> Courses Generated
          </h2>
          
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
            <div className="h-32 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01]">
            <p className="text-sm text-slate-500">No pipelines built yet. Run a blueprint query above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <motion.div
                key={course._id}
                whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.12)" }}
                className="p-5 rounded-xl bg-white/[0.01] border border-white/[0.06] transition-all duration-300 flex flex-col justify-between relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors m-0 text-left">{course.title}</h3>
                    <div className="p-1.5 rounded-md bg-white/[0.04] text-slate-400 group-hover:text-emerald-400 transition-colors">
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed text-left m-0">{course.description}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 truncate max-w-[200px] ">Prompt: "{course.prompt}"</span>
                  <Link 
                    to={`/course/${course._id}`} 
                    className="inline-flex items-center gap-1 font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Start Learning <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;