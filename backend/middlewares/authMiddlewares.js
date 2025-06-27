import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check if authorization header exists and starts with 'Bearer'
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Get token from header
                token = req.headers.authorization.split(' ')[1];
                
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Get user from the token
                req.user = await User.findById(decoded.id).select('-password');
                
                if (!req.user) {
                    return res.status(401).json({ message: 'User not found' });
                }
                
                next();
            } catch (error) {
                console.error('Token verification failed:', error);
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }
        }
        
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(500).json({ message: 'Server error in auth middleware' });
    }
};