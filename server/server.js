/*
  Here we will import some libraries like cors for getting request from different port, expresss.json() to allow json request from different port.

  then we mount the api's to the routes.

  then we connect to db and then start listening at the port. 

*/

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Loads environment variables from a .env file

const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const app = express();
const PORT = process.env.PORT;

// 1. Global Middleware
app.use(cors()); // Fixes the CORS cross-port security blocks
app.use(express.json()); // Allows Express to parse JSON incoming request bodies

// 2. Mount API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);

// 3. MongoDB Connection
// Replace the fallback string with your actual local or Atlas string if needed
const MONGO_URI = process.env.MONGO_URI;
// console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      "🚀 MongoDB Database connected successfully!",
      mongoose.connection.name,
    );

    // 4. Start listening for network traffic ONLY after DB is ready
    app.listen(PORT, () => {
      console.log(`📡 Server actively listening on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "❌ Database connection failed to initialize:",
      error.message,
    );
    process.exit(1);
  });
