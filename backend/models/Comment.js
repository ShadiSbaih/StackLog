import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BlogPost',
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 5000
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;