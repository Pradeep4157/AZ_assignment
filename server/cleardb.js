require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/Course");
const Module = require("./models/Module");
const Lesson = require("./models/Lesson");

async function clearDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Lesson.deleteMany({});
    await Module.deleteMany({});
    await Course.deleteMany({});

    console.log("Database cleared successfully.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearDB();
