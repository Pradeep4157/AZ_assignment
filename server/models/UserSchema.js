const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate users are created for the same Google account
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // Stores their Google profile picture URL
    },
  },
  { timestamps: true }, // Automatically manages createdAt and updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);
