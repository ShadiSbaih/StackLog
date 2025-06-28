import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';

dotenv.config();

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// ?@desc Register a new user
// ?@route POST /api/auth/register
// ?@access Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, profileImageUrl, bio, adminAccessToken } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //determine if the user is an admin
    let role = "member";
    if (adminAccessToken && adminAccessToken == parseInt(process.env.ADMIN_ACCESS_TOKEN)) {
        role = "admin";
        console.log("received admin access token:", adminAccessToken);
        console.log("expected admin access token:", process.env.ADMIN_ACCESS_TOKEN);
    }
    // Create new user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        bio,
        profileImageUrl,
        role
    });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        token: generateToken(user._id),
    });
});

// ?@desc Login user
// ?@route POST /api/auth/login
// ?@access Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    //check if password is correct
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        token: generateToken(user._id),
    });
});


// ?@desc Get user profile
// ?@route GET /api/auth/profile
// ?@access Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v -updatedAt');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});