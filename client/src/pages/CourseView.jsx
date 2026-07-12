import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu } from "lucide-react";


function CourseView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const markCompleted = async (lessonId) => {
  // Save UI immediately
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) =>
          lesson._id === lessonId
            ? { ...lesson, completed: true }
            : lesson
        ),
      })),
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/complete`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to update lesson");
      }
    } catch (err) {
      console.error(err);

      // Revert UI if request failed
      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson._id === lessonId
              ? { ...lesson, completed: false }
              : lesson
          ),
        })),
      }));
    }
  };
  const markIncomplete = async (lessonId) => {
    // Update immediately
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) =>
          lesson._id === lessonId
            ? { ...lesson, completed: false }
            : lesson
        ),
      })),
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}/incomplete`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to update lesson");
      }
    } catch (err) {
      console.error(err);

      // Revert if backend failed
      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson._id === lessonId
              ? { ...lesson, completed: true }
              : lesson
          ),
        })),
      }));
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`);
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

  if (loading) return <div className="text-sm  text-slate-500 animate-pulse">&gt; Pulling dynamic node layout trees...</div>;
  if (!course) return <div className="text-sm text-rose-400">Schema instantiation trace missing. <Link to="/" className="underline">Abort</Link></div>;
  const totalLessons = course.modules.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0
  );

  const completedLessons = course.modules.reduce(
    (sum, mod) =>
      sum + mod.lessons.filter((lesson) => lesson.completed).length,
    0
  );

  const progress =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);
  return (
    <div className="space-y-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors group">
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Return to Base Dashboard
      </Link>
      
      {/* Structural Header Grid */}
      <div className="border-b border-white/[0.06] pb-8 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white">{course.title}</h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">{course.description}</p>
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Training Progress
            </p>

            <h3 className="mt-2 text-3xl font-semibold text-white">
              {progress}%
            </h3>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-emerald-400">
              {completedLessons} Nodes Compiled
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {totalLessons - completedLessons} Remaining
            </div>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-500"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {completedLessons} / {totalLessons} Lessons
          </span>

          <span className="text-emerald-400">
            {progress === 100
              ? "Course Complete"
              : "Learning In Progress"}
          </span>
        </div>
      </div>

      {/* Modules/Lessons Tree Section */}
      <div className="space-y-8">
        <h2 className="text-xs  uppercase tracking-wider text-slate-500">Compiled Path Modules</h2>
        
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
                <div className="space-y-3">
                  <span className="text-[10px]  uppercase tracking-wider text-emerald-400">Block {String(modIdx + 1).padStart(2, '0')}</span>
                  <h3 className="text-sm font-medium text-white">{mod.title}</h3>
                </div>
              </div>
              
              {/* Lessons Stack */}
              <div className="divide-y divide-white/[0.04] bg-black/20">
                {mod.lessons.map((lesson, lesIdx) => (
                  <div 
                    key={lesson._id}
                    className="px-5 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 group hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-5 w-5 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px]  text-slate-400">
                        {modIdx + 1}.{lesIdx + 1}
                      </div>
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors break-words">{lesson.title}</span>
                    </div>
                    
                      <div className="flex w-full md:w-auto justify-end gap-3 shrink-0">
                        <button
                            onClick={() => navigate(`/lesson/${lesson._id}`)}
                            className="h-8 px-4 rounded bg-white/[0.04] border border-white/[0.08]
                                      text-slate-300 hover:text-white hover:bg-white/[0.08]
                                      hover:border-white/[0.15] text-[11px] font-medium
                                      transition-all flex items-center gap-1.5
                                      whitespace-nowrap active:scale-[0.97]"
                        >
                            <Cpu className="h-3 w-3 text-cyan-400" />
                            Compile Node
                        </button>

                        <button
                            onClick={() =>
                                lesson.completed
                                    ? markIncomplete(lesson._id)
                                    : markCompleted(lesson._id)
                            }
                            className={`h-8 min-w-[140px] px-4 rounded
                                        text-[11px] font-medium transition-all
                                        ${
                                            lesson.completed
                                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                : "bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-emerald-500 hover:text-white"
                                        }`}
                        >
                            {lesson.completed ? "Completed ✓" : "Mark Complete"}
                        </button>
                    </div>
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