// middleware/auth.js
module.exports = {
    isAuthenticated: (req, res, next) => {
      if (req.session.user) {
        next(); // User is logged in
      } else {
        res.status(401).json({ error: "Unauthorized: Please log in" });
      }
    },
  
    isAdmin: (req, res, next) => {
      if (req.session.user && req.session.user.role === "admin") {
        next(); // User is admin, allow access
      } else {
        res.status(403).json({ error: "Forbidden: Admins only" });
      }
    }
  };
  