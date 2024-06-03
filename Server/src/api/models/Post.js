// models/Post.js
import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [replySchema]
});

const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    photo: { type: String },  // New field for photo URL
    video: { type: String },  // New field for video URL
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New field for likes
    comments: [commentSchema]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
