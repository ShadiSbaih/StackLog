import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        coverImageUrl: { type: String, default: null },
        content: { type: String, required: true },
        tags: [{ type: String }],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isDraft: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        generatedByAi: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
export default BlogPost;