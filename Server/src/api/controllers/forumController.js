import mongoose from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';
import NotificationController from './notificationController.js';

const ForumController = (io) => ({
    async createPost(req, res) {
        try {
            const userId = req.user._id;
            const { content } = req.body;
            let file = req.file;

            if (!content && !file) {
                return res.status(400).json({ message: 'Content or file is required.' });
            }

            let newPost = new Post({ author: userId, content });

            if (file) {
                if (file.mimetype.startsWith('image/')) {
                    newPost.photo = file.path;
                } else if (file.mimetype.startsWith('video/')) {
                    newPost.video = file.path;
                }
            }

            await newPost.save();
            newPost = await Post.findById(newPost._id).populate('author');

            const users = await User.find({ _id: { $ne: userId } });
            users.forEach(user => {
                if (mongoose.Types.ObjectId.isValid(user._id)) {
                    NotificationController.createNotification(
                        user._id,
                        'New Forum Post',
                        'New post created in the forum',
                        `/posts/${newPost._id}`
                    );
                } else {
                    console.error('Invalid user ID:', user._id);
                }
            });

            io.emit('newPost', newPost);

            res.status(201).json({ message: 'Post created successfully', post: newPost });
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ message: 'An error occurred while creating the post.' });
        }
    },

    async commentOnPost(req, res) {
        try {
            const { postId } = req.params;
            const { content } = req.body;

            let post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const comment = { author: req.user._id, content, createdAt: new Date() };
            post.comments.push(comment);
            await post.save();

            post = await Post.findById(postId).populate('author').populate('comments.author');

            const newComment = post.comments[post.comments.length - 1];

            const uniqueUserIds = new Set(post.comments.map(comment => comment.author.toString()));
            uniqueUserIds.add(post.author.toString());
            uniqueUserIds.delete(req.user._id.toString());

            uniqueUserIds.forEach(userId => {
                if (mongoose.Types.ObjectId.isValid(userId)) {
                    NotificationController.createNotification(
                        userId,
                        'New Comment',
                        `New comment on your post`,
                        `/posts/${postId}`
                    );
                } else {
                    console.error('Invalid user ID:', userId);
                }
            });

            io.emit('newComment', { postId, comment: newComment });

            res.status(200).json({ message: 'Comment added successfully', post });
        } catch (error) {
            console.error("Error adding comment:", error);
            res.status(500).json({ message: 'An error occurred while adding the comment.' });
        }
    },

    async replyToComment(req, res) {
        try {
            const { postId, commentId } = req.params;
            const { content } = req.body;

            let post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            const reply = { author: req.user._id, content, createdAt: new Date() };
            comment.replies.push(reply);
            await post.save();

            post = await Post.findById(postId).populate('author').populate('comments.author').populate('comments.replies.author');

            const newReply = comment.replies[comment.replies.length - 1];

            const uniqueUserIds = new Set([...post.comments.map(c => c.author.toString()), post.author.toString()]);
            uniqueUserIds.add(comment.author.toString());
            uniqueUserIds.delete(req.user._id.toString());

            uniqueUserIds.forEach(userId => {
                if (mongoose.Types.ObjectId.isValid(userId)) {
                    NotificationController.createNotification(
                        userId,
                        'New Reply',
                        `New reply on your comment in post`,
                        `/posts/${postId}`
                    );
                } else {
                    console.error('Invalid user ID:', userId);
                }
            });

            io.emit('newReply', { postId, commentId, reply: newReply });

            res.status(200).json({ message: 'Reply added successfully', post });
        } catch (error) {
            console.error("Error adding reply:", error);
            res.status(500).json({ message: 'An error occurred while adding the reply.' });
        }
    },

    async likePost(req, res) {
        try {
            console.log("likePost called with postId:", req.params.postId);
            const { postId } = req.params;
            const userId = req.user._id;

            console.log("User ID:", userId);

            let post = await Post.findById(postId);
            if (!post) {
                console.error("Post not found");
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.likes.includes(userId)) {
                post.likes = post.likes.filter(id => id.toString() !== userId.toString());
                console.log("User unliked the post");
            } else {
                post.likes.push(userId);
                console.log("User liked the post");
            }

            await post.save();

            post = await Post.findById(postId).populate('author');

            io.emit('updateLikes', { postId, likes: post.likes });
            console.log("Emitted updateLikes event for postId:", postId);

            res.status(200).json({ message: 'Post liked/unliked successfully', post });
        } catch (error) {
            console.error("Error liking post:", error);
            res.status(500).json({ message: 'An error occurred while liking the post.' });
        }
    },

    async getAllPosts(req, res) {
        try {
            const posts = await Post.find()
                                    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                                    .populate('author')
                                    .populate('comments.author')
                                    .populate('comments.replies.author');
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).json({ message: 'An error occurred while fetching the posts.' });
        }
    },

    async getPost(req, res) {
        try {
            const { postId } = req.params;
            const post = await Post.findById(postId)
                                   .populate('author')
                                   .populate('comments.author')
                                   .populate('comments.replies.author');

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(200).json(post);
        } catch (error) {
            console.error("Error fetching post:", error);
            res.status(500).json({ message: 'An error occurred while fetching the post.' });
        }
    },

    async deletePost(req, res) {
        try {
            const { postId } = req.params;

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You do not have permission to delete this post.' });
            }

            await Post.findByIdAndDelete(postId);

            io.emit('deletePost', { postId });

            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({ message: 'An error occurred while deleting the post.' });
        }
    },

    async editPost(req, res) {
        try {
            const { postId } = req.params;
            const { content } = req.body;

            let post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You do not have permission to edit this post.' });
            }

            post.content = content;
            await post.save();

            post = await Post.findById(postId).populate('author');

            io.emit('editPost', { postId, content: post.content });

            res.status(200).json({ message: 'Post edited successfully', post });
        } catch (error) {
            console.error("Error editing post:", error);
            res.status(500).json({ message: 'An error occurred while editing the post.' });
        }
    },

    async editComment(req, res) {
        try {
            const { postId, commentId } = req.params;
            const { content } = req.body;

            let post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            if (comment.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You do not have permission to edit this comment.' });
            }

            comment.content = content;
            await post.save();

            io.emit('editComment', { postId, commentId, content: comment.content });

            res.status(200).json({ message: 'Comment edited successfully', post });
        } catch (error) {
            console.error("Error editing comment:", error);
            res.status(500).json({ message: 'An error occurred while editing the comment.' });
        }
    },

    async deleteComment(req, res) {
        try {
            const { postId, commentId } = req.params;

            let post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const comment = post.comments.id(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            if (comment.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You do not have permission to delete this comment.' });
            }

            comment.remove();
            await post.save();

            io.emit('deleteComment', { postId, commentId });

            res.status(200).json({ message: 'Comment deleted successfully', post });
        } catch (error) {
            console.error("Error deleting comment:", error);
            res.status(500).json({ message: 'An error occurred while deleting the comment.' });
        }
    },

    async searchPosts(req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({ message: 'Query parameter is required' });
            }

            const posts = await Post.find({
                $or: [
                    { content: { $regex: query, $options: 'i' } },
                    { 'author.name': { $regex: query, $options: 'i' } }
                ]
            })
            .sort({ createdAt: -1 })
            .populate('author')
            .populate('comments.author')
            .populate('comments.replies.author');

            res.status(200).json(posts);
        } catch (error) {
            console.error("Error searching posts:", error);
            res.status(500).json({ message: 'An error occurred while searching the posts.' });
        }
    },

    async getPostCount(req, res) {
        try {
            const userId = req.params.userId;
            const postCount = await Post.countDocuments({ author: userId });
            res.status(200).json({ postCount });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving post count: ' + error.message });
        }
    },
    async getTotalPostCount(req, res) {
        try {
            const totalPostCount = await Post.countDocuments();
            res.status(200).json({ totalPostCount });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving total post count: ' + error.message });
        }
    },
    // In your forum controller
    async getUserPosts(req, res) {
        try {
            const userId = req.params.userId;
            console.log("Fetching posts for user:", userId); // Add this line for debugging
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }
            const posts = await Post.find({ author: userId })
                                    .sort({ createdAt: -1 })
                                    .populate('author')
                                    .populate('comments.author')
                                    .populate('comments.replies.author');
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user posts: ' + error.message });
        }
    }

      
});

export default ForumController;
