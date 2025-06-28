import BlogPost from '../models/BlogPost.js';
import asyncHandler from 'express-async-handler';
import Comment from '../models/Comment.js';
import User from '../models/User.js';


// @desc    Dashboard summary
// @route   GET /api/dashboard-summary
// @access  Private/Admin
export const getDashboardSummary = asyncHandler(async (req, res) => {
    // Run all queries in parallel for better performance
    const [
        totalPosts,
        drafts,
        published,
        totalComments,
        aiGenerated,
        totalUsers,
        totalViewsAgg,
        totalLikesAgg,
        topPosts,
        recentComments,
        tagUsage
    ] = await Promise.all([
        BlogPost.countDocuments({}),
        BlogPost.countDocuments({ isDraft: true }),
        BlogPost.countDocuments({ isDraft: false }),
        Comment.countDocuments({}),
        BlogPost.countDocuments({ generatedByAI: true }),
        User.countDocuments({ role: 'user' }),
        BlogPost.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]),
        BlogPost.aggregate([
            { $group: { _id: null, total: { $sum: '$likes' } } }
        ]),
        BlogPost.find({ isDraft: false })
            .select("title coverImageUrl views likes")
            .sort({ views: -1, likes: -1 })
            .limit(5),
        Comment.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("author", "name profileImageUrl")
            .populate("post", "title coverImageUrl"),
        BlogPost.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $project: { tag: "$_id", count: 1, _id: 0 } },
            { $sort: { count: -1 } }
        ])
    ]);

    const totalViews = totalViewsAgg[0]?.total || 0;
    const totalLikes = totalLikesAgg[0]?.total || 0;

    res.status(200).json({
        success: true,
        message: 'Dashboard summary fetched successfully',
        stats: {
            totalPosts,
            drafts,
            published,
            totalComments,
            aiGenerated,
            totalUsers,
            totalViews,
            totalLikes,
        },
        topPosts,
        recentComments,
        tagUsage,
    });
});