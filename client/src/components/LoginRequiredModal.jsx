import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, X } from "lucide-react";

function LoginRequiredModal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl"
            >
              {/* Top Decorative Soft Glow Background */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-5 top-5 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
              >
                <X size={16} />
              </button>

              {/* Security Icon Header */}
              <div className="flex justify-center">
                <div className="relative h-12 w-12 rounded-xl bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center shadow-inner shadow-cyan-500/10">
                  <Lock size={20} className="text-cyan-400" />
                </div>
              </div>

              {/* Title Content */}
              <h2 className="mt-5 text-center text-xl font-semibold text-slate-50 tracking-tight">
                Unlock AI Learning Roadmaps
              </h2>

              <p className="mt-2.5 text-center text-sm text-slate-400 leading-relaxed max-w-[320px] mx-auto">
                Sign in to customize, save, and launch your personalized course track instantly.
              </p>

              {/* Feature Value Propositions List */}
              <div className="mt-6 rounded-xl border border-slate-800/60 bg-slate-950/30 p-4 space-y-3.5 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-cyan-400 h-4 w-4 mt-0.5 shrink-0" />
                  <span>Generate and save unlimited customized blueprints</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-cyan-400 h-4 w-4 mt-0.5 shrink-0" />
                  <span>Interactive module checkmarks & progress tracking</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-cyan-400 h-4 w-4 mt-0.5 shrink-0" />
                  <span>Sync seamlessly across dynamic layouts and devices</span>
                </div>
              </div>

              {/* Dynamic Google Button Area Injection */}
              <div className="mt-6 relative z-10">
                {children}
              </div>

              {/* Postponement Footer Action */}
              <button
                onClick={onClose}
                className="mt-4 w-full text-center text-xs font-medium text-slate-500 hover:text-slate-300 tracking-wide uppercase transition-colors py-1"
              >
                Maybe Later
              </button>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LoginRequiredModal;