import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

function PromptForm({ onCourseCreated }) {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [statusText, setStatusText] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setLoading(true);
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
        if (onCourseCreated) onCourseCreated();
      }
    } catch (error) {
      console.error("Pipeline failure:", error);
      setStatusText("Generation cycle faulted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} className="space-y-8">
      <div className="flex flex-col space-y-4">
        <label className="text-xs  uppercase tracking-wider text-slate-400">Target Core Knowledge Graph</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            disabled={loading}
            placeholder="e.g., Event-Driven Microservices Architecture with Kafka" 
            className="flex-1 bg-black/40 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={loading || !topic.trim()}
            className="h-10 px-5 rounded-lg bg-white text-black font-medium text-sm hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap shadow-md shadow-white/5"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-emerald-600 fill-emerald-600/30" />
                Execute Blueprint
              </>
            )}
          </button>
        </div>
      </div>
      {statusText && (
        <p className="text-xs  text-cyan-400 animate-pulse flex items-center gap-2">
          <span>&gt;</span> {statusText}
        </p>
      )}
    </form>
  );
}

export default PromptForm;