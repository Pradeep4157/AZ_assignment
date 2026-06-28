const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Google ID token is required." });
  }

  try {
    // 1. Verify the Google token with Google's servers
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get user payload from Google
    const { sub: googleId, email, name, picture: avatar } = ticket.getPayload();

    // 2. Check if user already exists in our MongoDB
    let user = await User.findOne({ googleId });

    if (!user) {
      // If user doesn't exist, register them!
      user = new User({
        googleId,
        email,
        name,
        avatar,
      });
      await user.save();
    }

    // 3. Generate your own custom JWT for your app session
    const appToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token stays valid for 7 days
    );

    // 4. Send the JWT and user info back to React
    return res.status(200).json({
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res
      .status(401)
      .json({ message: "Invalid Google token authentication failed." });
  }
};
