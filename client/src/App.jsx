import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CourseView from "./pages/CourseView";
import LessonView from "./pages/LessonView";
import { Sparkles } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#030712] text-slate-100  selection:bg-emerald-500/30 relative overflow-x-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none" />
        
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <header className="sticky top-0 z-50 max-w-7xl mx-auto px-6 h-16 flex items-center justify-between border-b border-white/[0.06] bg-[#030712]/70 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-sm tracking-tight text-white hover:opacity-90 transition-opacity">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-4 w-4 text-black stroke-[2.5]" />
            </div>
            <span>curriculum<span className="text-emerald-400">.ai</span></span>
          </Link>
          
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">v1.0.0-beta</span>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto px-8 py-20 relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/course/:id" element={<CourseView />} />
            <Route path="/lesson/:lessonId" element = {<LessonView/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;