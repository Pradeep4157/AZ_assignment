import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

function MCQCard({ question }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-xl p-6 space-y-8 relative overflow-hidden">
      {/* Decorative subtle accent lighting in card */}
      <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-br from-emerald-500/5 to-transparent blur-2xl pointer-events-none" />
      
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-white/[0.04] text-slate-400 shrink-0 mt-0.5">
          <HelpCircle className="h-4 w-4" />
        </div>
        <h3 className="font-medium text-base text-slate-200 leading-snug">
          {question.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correct_answer;
          
          let optionStyles = "border-white/[0.06] bg-white/[0.01] text-slate-400 hover:border-white/[0.12] hover:bg-white/[0.02]";
          if (isSelected) {
            optionStyles = isCorrect 
              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
              : "border-red-500/30 bg-red-500/5 text-red-400";
          }

          return (
            <motion.button
              key={option}
              whileHover={!selected ? { x: 2 } : {}}
              onClick={() => setSelected(option)}
              className={`w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-all duration-200 flex items-center justify-between font-normal group relative ${optionStyles}`}
            >
              <span className="flex-1 pr-4">{option}</span>
              
              {isSelected && (
                <div className="shrink-0">
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/10" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 fill-red-400/10" />
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {selected && (
        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs ">
          <span className="text-slate-500">Evaluation verification completed.</span>
          {selected === question.correct_answer ? (
            <span className="text-emerald-400 font-medium">Status: Correct Answer.</span>
          ) : (
            <span className="text-red-400 font-medium">Status: Wrong Answer.</span>
          )}
        </div>
      )}
    </div>
  );
}

export default MCQCard;