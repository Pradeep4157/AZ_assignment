import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Video, Terminal, AlertCircle } from "lucide-react";
import MCQCard from "../components/MCQCard";

function LessonView() {
  const {lessonId} = useParams();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  useEffect(() => {
    const generateLesson = async() => {
      try{
        const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}/generate`,{
          method: "POST"
        });
        const res = await response.json();
        if(res.success){
          setLesson(res.data);
        }
      }catch(error){
        console.log("Error while fetching course", error);
      }finally{
        setLoading(false);
      }
    }
    generateLesson();
  },[lessonId])

  // const { lessonId } = useParams();
  // const [lesson, setLesson] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const generateLesson = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:5000/api/lessons/${lessonId}/generate`,
  //         { method: "POST" }
  //       );
  //       const result = await response.json();
  //       if (result.success) {
  //         setLesson(result.data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   generateLesson();
  // }, [lessonId]);
  

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-center w-full">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">Generating micro-lessons</p>
          <p className="text-xs  text-slate-500">Executing deterministic generation pipeline...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20 w-full">
        <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
        <p className="text-sm text-red-400 font-medium">Pipeline fault: Failed to render lesson environment.</p>
      </div>
    );
  }

  return (
    // Removed max-w-4xl mx-auto so it natively stretches to App's max-w-7xl content bounds
    <div className="w-full space-y-12 text-left pb-24">
      
      {/* Navigation & Header */}
      <div className="space-y-6">
        <Link
          to={-1}
          className="inline-flex items-center gap-1.5 text-xs  uppercase tracking-wider text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          Back to roadmap
        </Link>

        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
          {lesson.title}
        </h1>
      </div>

      {/* Structured Content Blocks - Fully Fluid Width Layout */}
      <div className="space-y-10 w-full">
        {lesson.content.map((block, index) => {
          switch (block.type) {
            case "heading":
              return (
                <h2
                  key={index}
                  className="text-xl md:text-2xl font-semibold tracking-tight text-white pt-4 border-b border-white/[0.04] pb-2 w-full"
                >
                  {block.text}
                </h2>
              );

            case "paragraph":
              return (
                <p
                  key={index}
                  className="text-slate-300 leading-7 text-[15px] font-normal w-full"
                >
                  {block.text}
                </p>
              );

            case "code":
              return (
                <div
                  key={index}
                  className="w-full rounded-xl overflow-hidden border border-white/[0.06] bg-[#090d16]  group"
                >
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
                <div
                  key={index}
                  className="w-full rounded-xl border border-cyan-500/10 bg-cyan-500/[0.02] p-5 backdrop-blur-md flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                    <Video className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-sm font-medium text-cyan-400">
                      Recommended Video Resource
                    </h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                      {block.caption}
                    </p>
                    <a
                      href={block.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs  text-cyan-400 hover:text-cyan-300 underline underline-offset-4 mt-2 transition-colors"
                    >
                      Open Stream Interface &rarr;
                    </a>
                  </div>
                </div>
              );

            case "mcq":
              return (
                <MCQCard
                  key={index}
                  question={block}
                />
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

export default LessonView;