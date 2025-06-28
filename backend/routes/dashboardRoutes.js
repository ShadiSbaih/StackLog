import express from 'express';
import { protect } from "../middlewares/authMiddlewares.js"
import { getDashboardSummary } from "../controllers/dashboardController.js";

//Admin-only middleware

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: "Access denied" });
    }
}

const router = express.Router();

router.get('/', protect, adminOnly, getDashboardSummary);

export default router;