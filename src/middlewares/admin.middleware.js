const protectAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();  // Continue to the next middleware (route handler)
    } else {
        res.status(403).json({ message: "Forbidden: Admin access required" });
    }
};

export default protectAdmin