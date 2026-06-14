const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    creator: { type: String, required: true },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
    tags: { type: String, trim: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Course", CourseSchema);
