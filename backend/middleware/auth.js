const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  let token = null;

  // 1. Try Authorization header first
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Fallback to cookie token
  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: store only minimal info
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = authMiddleware;
