import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl"
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-5 top-5 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="flex justify-center">
                <div className="relative h-12 w-12 rounded-xl bg-gradient-to-b from-red-500/20 to-red-500/5 border border-red-500/20 flex items-center justify-center shadow-inner shadow-red-500/10">
                  <Trash2 size={20} className="text-red-400" />
                </div>
              </div>

              {/* Content */}
              <h2 className="mt-5 text-center text-xl font-semibold text-slate-50 tracking-tight">
                {title}
              </h2>

              <p className="mt-3 text-center text-sm text-slate-400 leading-relaxed max-w-[320px] mx-auto">
                {description}
              </p>

              {/* Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 h-10 rounded-xl border border-slate-700 bg-slate-800/50 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  className="flex-1 h-10 rounded-xl bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-all cursor-pointer"
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
