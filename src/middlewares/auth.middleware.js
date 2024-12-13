const jwt = require("jsonwebtoken");

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  },

  isDesigner: (req, res, next) => {
    if (req.user.role !== "designer") {
      return res
        .status(403)
        .json({ message: "Access denied. Designers only." });
    }
    next();
  },

  isPlayer: (req, res, next) => {
    if (req.user.role !== "player") {
      return res.status(403).json({ message: "Access denied. Players only." });
    }
    next();
  },
};

module.exports = authMiddleware;
