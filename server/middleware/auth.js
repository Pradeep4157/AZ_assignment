const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // 1. Get the token from the request header (Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Extract the actual token string
  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the decoded user payload (userId, email) to the request object
    req.user = decoded;

    // Pass control to the next function (the controller)
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = requireAuth;
