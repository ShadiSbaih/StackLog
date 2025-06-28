import express from 'express';
import {
    getAllComments,
    addComment,
    getCommentsByPost,
    deleteComment,
} from '../controllers/commentController.js';
import { protect } from "../middlewares/authMiddlewares.js"




const router = express.Router();


router.post("/:postId", protect, addComment);
router.get("/:postId", getCommentsByPost);
router.get("/", getAllComments);
router.delete("/:commentId", protect, deleteComment);



export default router;