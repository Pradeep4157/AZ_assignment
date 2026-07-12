const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: [mongoose.Schema.Types.Mixed], required: true },

    isEnriched: { type: Boolean, default: false },
    isGenerating: { type: Boolean, default: false },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },

    completed: {
      type: Boolean,
      default: false,
    },
    translations: {
      type: Map,
      of: {
        content: [mongoose.Schema.Types.Mixed],
        generatedAt: Date,
        model: String,
        // audioUrl: String,
      },
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lesson", lessonSchema);
