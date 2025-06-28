import Comment from "../models/Comment.js";
import BlogPost from "../models/BlogPost.js";
import asyncHandler from 'express-async-handler';

// @desc    Add a comment to a blog post
// @route   POST /api/comments/:postId
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content, parentComment } = req.body;
    //Ensure the post exists
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
        res.status(404);
        throw new Error('Blog post not found');
    }
    // Create a new comment
    const comment = new Comment({
        post: postId,
        author: req.user._id,
        content,
        parentComment: parentComment || null,
    });
    // Save the comment to the database
    await comment.populate('author', 'name profileImageUrl');

    await comment.save();
    res.status(201).json(comment);

});
// @desc    Get all comments
// @route   GET /api/comments
// @access  Public
export const getAllComments = asyncHandler(async (req, res) => {
    // Fetch all comments from the database 
    const comments = await Comment.find()
        .populate('author', 'name profileImageUrl')
        .populate('post', 'title coverImageUrl')
        .sort({ createdAt: -1 });

    // Create a map for commentId -> comment object
    const commentMap = {};
    const topLevelComments = [];

    // First pass: convert to plain objects and create map
    comments.forEach(comment => {
        const commentObj = comment.toObject();
        commentObj.replies = [];
        commentMap[commentObj._id] = commentObj;
    });

    // Second pass: nest replies under their parent comments
    comments.forEach(comment => {
        const commentObj = commentMap[comment._id];

        if (comment.parentComment) {
            // This is a reply
            const parent = commentMap[comment.parentComment];
            if (parent) {
                parent.replies.push(commentObj);
            }
        } else {
            // This is a top-level comment
            topLevelComments.push(commentObj);
        }
    });

    res.status(200).json(topLevelComments);
});
// @desc    Get comments by blog post
// @route   GET /api/comments/:postId
// @access  Public
export const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
        .populate('author', 'name profileImageUrl')
        .populate('post', 'title coverImageUrl')
        .sort({ createdAt: -1 });

    // Create a map for commentId -> comment object
    const commentMap = {};
    comments.forEach(comment => {
        const commentObj = comment.toObject();
        commentObj.replies = [];
        commentMap[commentObj._id] = commentObj;
    });

    // Nest replies under their parent comments
    const nestedComments = [];
    comments.forEach(comment => {
        const commentObj = commentMap[comment._id]; // Get the comment object from the map

        if (comment.parentComment) {
            const parent = commentMap[comment.parentComment];
            if (parent) {
                parent.replies.push(commentObj);
            }
        } else {
            nestedComments.push(commentObj);
        }
    });

    res.status(200).json(
        nestedComments // Also changed property name for consistency
    );
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }
    // Check if the user is the author of the comment
    //? Todo
    //Delete the comment
    await comment.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Comment and reply comments deleted successfully',
    });

});