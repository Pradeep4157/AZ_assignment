import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu, Play, CheckCircle } from "lucide-react";

function CourseView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        const result = await response.json();
        if (result.success) setCourse(result.data);
      } catch (error) {
        console.error("Error reading schema payload:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  if (loading) return <div className="text-sm font-mono text-slate-500 animate-pulse">&gt; Pulling dynamic node layout trees...</div>;
  if (!course) return <div className="text-sm text-rose-400">Schema instantiation trace missing. <Link to="/" className="underline">Abort</Link></div>;

  return (
    <div className="space-y-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors group">
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Return to Base Dashboard
      </Link>
      
      {/* Structural Header Grid */}
      <div className="border-b border-white/[0.06] pb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-white">{course.title}</h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">{course.description}</p>
      </div>

      {/* Modules/Lessons Tree Section */}
      <div className="space-y-8">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500">Compiled Path Modules</h2>
        
        <div className="space-y-6">
          {course.modules.map((mod, modIdx) => (
            <motion.div 
              key={mod._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: modIdx * 0.08 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden"
            >
              {/* Module Header Bar */}
              <div className="px-5 py-4 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Block {String(modIdx + 1).padStart(2, '0')}</span>
                  <h3 className="text-sm font-medium text-white">{mod.title}</h3>
                </div>
              </div>
              
              {/* Lessons Stack */}
              <div className="divide-y divide-white/[0.04] bg-black/20">
                {mod.lessons.map((lesson, lesIdx) => (
                  <div 
                    key={lesson._id}
                    className="px-5 py-3.5 flex items-center justify-between gap-6 group hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-5 w-5 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] font-mono text-slate-400">
                        {modIdx + 1}.{lesIdx + 1}
                      </div>
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors truncate">{lesson.title}</span>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/lesson/${lesson._id}`)}
                      className="h-7 px-3 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-[0.97]"
                    >
                      <Cpu className="h-3 w-3 text-cyan-400" />
                      Compile Node
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseView;