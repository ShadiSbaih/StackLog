import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes using regular import statements
import authRoutes from './routes/authRoutes.js';
import blogPostRoutes from './routes/blogPostRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

//Middlewares to handle CORS 
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//Connect to MongoDB
connectDB();

//Middlewares to parse JSON and URL-encoded data
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', blogPostRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard-summary', dashboardRoutes);
app.use('/api/ai', aiRoutes);

//serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});