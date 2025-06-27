import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddlewares.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Route to handle image upload
// This route uses multer middleware to handle file uploads

//@desc Upload image
//@route POST /api/auth/upload-image
//@access Private
router.post("/upload-image", protect, upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });

});


export default router;