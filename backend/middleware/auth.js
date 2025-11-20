const jwt = require("jsonwebtoken");
const User = require("../model/UserModel"); 

async function authMiddleware(req, res, next) {
  // 1. Read token from cookie
  let token = req.cookies.token;

  // 2. If no cookie, read Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = authMiddleware;
