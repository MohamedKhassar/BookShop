const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.cookie;
  if (!token) {
    console.log("Token not provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token.replace("token=", ""), "secretKey", (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      req.user = decoded;
      next();
    }
  });
};

module.exports = authMiddleware;
