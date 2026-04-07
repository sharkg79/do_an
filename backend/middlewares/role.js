// middlewares/role.js

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Check auth
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Validate allowedRoles
      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        return res.status(500).json({ message: "Server role config error" });
      }

      // Check role tồn tại
      if (!req.user.role) {
        return res.status(403).json({ message: "User role not found" });
      }

      // Check permission
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied",
          role: req.user.role, // giúp debug khi demo
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "Authorization error" });
    }
  };
};

module.exports = authorize;