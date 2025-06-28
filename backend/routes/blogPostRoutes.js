import express from 'express';
import { protect } from '../middlewares/authMiddlewares.js';
import {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    getPostsByTag,
    searchPosts,
    incrementView,
    likePost,
    getTopPosts,
} from '../controllers/blogPostController.js';



const router = express.Router();

//Admin-only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role == 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}


//routes
router.post("/",protect, adminOnly, createPost);
router.get("/", getAllPosts);
router.get("/slug/:slug", getPostBySlug);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);
// ** OR
// ** router.route("/:id").put(protect, adminOnly, updatePost).delete(protect, adminOnly, deletePost); 
router.get("/tag/:tag", getPostsByTag);
router.get("/search", searchPosts);
router.post("/:id/view", incrementView);
router.post("/:id/like", protect, likePost);
router.get("/trending", getTopPosts);


// Export the router
export default router;
