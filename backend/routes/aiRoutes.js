import express, { Router } from 'express';
import { protect } from "../middlewares/authMiddlewares.js"

import {generateBlogPost,generatedBlogPostIdeas, generateCommentReply,generatePostSummary}
 from '../controllers/aiController.js';

const router= express.Router();

router.post("/generate", protect, generateBlogPost);
router.post("/generate-ideas", protect, generatedBlogPostIdeas);
router.post("/generate-reply", protect, generateCommentReply);
router.post("/generate-summary", generatePostSummary);

export default router;