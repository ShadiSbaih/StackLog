import mongoose from "mongoose";
import BlogPost from "../models/BlogPost.js";
import asyncHandler from 'express-async-handler';

// @desc Create a new blog post
// @route POST /api/posts
// @access Private (Admin only)
export const createPost = asyncHandler(async (req, res) => {
    const { title, content, tags, isDraft, coverImageUrl, generatedByAI } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const newPost = new BlogPost({
        title,
        slug,
        content,
        coverImageUrl: coverImageUrl || null,
        tags,
        author: req.user._id,
        isDraft: isDraft || false,
        generatedByAI: generatedByAI || false,
    });

    await newPost.save();

    res.status(201).json({
        message: "Post created successfully",
        newPost
    });
});

// @desc Update a blog post
// @route PUT /api/posts/:id
// @access Private (Admin or Author)
export const updatePost = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const post = await BlogPost.findById(postId);

    if (!post) {
        return res.status(404).json({
            message: "Post Not Found"
        });
    }

    if (post.author.toString() !== req.user._id.toString() &&
        !req.user.roles.includes('admin')) {
        return res.status(403).json({
            message: "Not Authorized to update this post"
        });
    }

    const updatedData = req.body;
    // Ensure slug is updated if title changes
    if (updatedData.title && updatedData.title !== post.title) {
        updatedData.slug = updatedData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
        { _id: postId },
        updatedData, {
        new: true,
    });

    res.status(200).json({
        status: "success",
        message: "Post updated successfully",
        updatedPost
    });
});

// @desc Delete a blog post
// @route DELETE /api/posts/:id
// @access Private (Admin or Author)
export const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await BlogPost.findById(postId);
    if (!post) {
        return res.status(404).json({
            message: "Post Not Found"
        });
    }
    if (post.author.toString() !== req.user._id.toString() &&
        !req.user.roles.includes('admin')) {
        return res.status(403).json({
            message: "Not Authorized to delete this post"
        });
    }
    await post.deleteOne();
    res.status(200).json({
        status: "success",
        message: "Post deleted successfully"
    });
});

// @desc Get all blog by status (published, draft, or all) and include counts
// @route GET /api/posts?status=published|draft|all&page=1
// @access Public
export const getAllPosts = asyncHandler(async (req, res) => {
    const status = req.query.status || 'published';
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit;// Calculate the number of posts to skip

    //determine filter for main posts response
    let filter = {};
    if (status === 'published') { filter.isDraft = false; }
    else if (status === 'draft') { filter.isDraft = true; }

    // Fetch paginated posts
    const posts = await BlogPost.find(filter)
        .populate('author', 'name profileImageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Count total posts for the given status
    const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([
        BlogPost.countDocuments(filter),
        BlogPost.countDocuments({}),
        BlogPost.countDocuments({ isDraft: false }),
        BlogPost.countDocuments({ isDraft: true })
        // Count all posts, published posts, and draft posts
    ]);

    res.status(200).json({
        status: "success",
        message: "Posts fetched successfully",
        posts,
        page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        counts: {
            all: allCount,
            published: publishedCount,
            draft: draftCount
        }
    });
});

// @desc Get a blog post by slug
// @route GET /api/posts/slug/:slug
// @access Public
export const getPostBySlug = asyncHandler(async (req, res) => {
    const post = await BlogPost.findOne({ slug: req.params.slug })
        .populate('author', 'name profileImageUrl');// Populate author details

    if (!post) {
        return res.status(404).json({
            message: "Post Not Found"
        });
    }

    res.status(200).json({
        status: "success",
        message: "Post fetched successfully",
        post
    });
});

// @desc Get blog posts by tag
// @route GET /api/posts/tag/:tag
// @access Public
export const getPostsByTag = asyncHandler(async (req, res) => {
    const posts = await BlogPost.find({ tags: req.params.tag, isDraft: false })
        .populate('author', 'name profileImageUrl') // Populate author details

    res.status(200).json({
        status: "success",
        message: "Posts fetched successfully",
        posts
    });
});

// @desc Search blog posts by title or content
// @route GET /api/posts/search?q=keyword
// @access Public
export const searchPosts = asyncHandler(async (req, res) => {
    const q = req.query.q || '';
    const posts = await BlogPost.find({
        isDraft: false,
        $or: [
            { title: { $regex: q, $options: 'i' } }, // Case-insensitive search in title
            { content: { $regex: q, $options: 'i' } } // Case-insensitive search in content
        ],
    }).populate('author', 'name profileImageUrl') // Populate author details

    res.status(200).json({
        status: "success",
        message: "Posts fetched successfully",
        posts
    });
});

// @desc Increment views for a blog post
// @route PUT /api/posts/:id/view
// @access Public
export const incrementView = asyncHandler(async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    res.status(200).json({
        status: "success",
        message: "Views incremented successfully"
    });
});

// @desc Like a blog post
// @route PUT /api/posts/:id/like
// @access Public
export const likePost = asyncHandler(async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
    );
    res.status(200).json({
        status: "success",
        message: "Post liked successfully"
    });
});

// @desc Get of trending posts based on likes and views
// @route GET /api/posts/trending
// @access private
export const getTopPosts = asyncHandler(async (req, res) => {
    //top performing posts based on likes and views
    const posts = await BlogPost.find({ isDraft: false }).
        sort({ likes: -1, views: -1 }). // Sort by likes and then by views
        limit(5);// Limit to top 5 posts

    return res.status(200).json({
        status: "success",
        message: "Top posts fetched successfully",
        posts
    });
});