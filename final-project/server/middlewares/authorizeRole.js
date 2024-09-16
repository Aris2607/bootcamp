const authorizeRole = (roles) => (req, res, next) => {
  const userRole = req.user.role; // Asumsikan role pengguna disimpan di req.user setelah autentikasi

  if (!roles.includes(userRole)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

module.exports = authorizeRole;
