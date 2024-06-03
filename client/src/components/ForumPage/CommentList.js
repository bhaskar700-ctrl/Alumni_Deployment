import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { deleteComment, editComment } from '../../redux/store/forumSlice';
import CreateReply from './CreateReply';
import { FaEdit, FaTrash } from 'react-icons/fa';

const mediaBaseUrl = process.env.REACT_APP_BACKEND_URL;

const CommentList = ({ comments, postId }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user); // Assuming you have user info in auth state
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [editMode, setEditMode] = useState({});
    const [editContent, setEditContent] = useState({});

    const handleReply = (commentId) => {
        setSelectedCommentId(commentId);
    };

    const handleEditComment = (commentId, content) => {
        setEditMode(prevState => ({
            ...prevState,
            [commentId]: true
        }));
        setEditContent(prevState => ({
            ...prevState,
            [commentId]: content
        }));
    };

    const handleSaveEdit = (commentId) => {
        dispatch(editComment({ postId, commentId, content: editContent[commentId] }));
        setEditMode(prevState => ({
            ...prevState,
            [commentId]: false
        }));
    };

    const handleDeleteComment = (commentId) => {
        dispatch(deleteComment({ postId, commentId }));
    };

    const handleEditChange = (commentId, content) => {
        setEditContent(prevState => ({
            ...prevState,
            [commentId]: content
        }));
    };

    const constructProfilePictureUrl = (profilePicture) => {
        if (!profilePicture) return 'https://via.placeholder.com/150';
        if (profilePicture.startsWith('http')) return profilePicture;
        return `${mediaBaseUrl}/${profilePicture.replace(/^\/+/, '')}`;
    };

    return (
        <div className="mt-4">
            {comments.map(comment => {
                const personalDetails = comment.author?.personalDetails;
                const { firstName, lastName, profilePicture } = personalDetails || {};

                if (!firstName || !lastName) {
                    return null; // Skip rendering if personalDetails are not available
                }

                const profilePictureUrl = constructProfilePictureUrl(profilePicture);

                console.log('Profile Picture URL:', profilePictureUrl);

                return (
                    <div key={comment._id} className="mt-2 p-2 bg-gray-100 rounded flex flex-col">
                        <div className="flex items-start">
                            {profilePicture ? (
                                <img
                                    src={profilePictureUrl}
                                    alt={`${firstName} ${lastName}`}
                                    className="h-10 w-10 rounded-full mr-2"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="h-10 w-10 rounded-full mr-2 text-gray-400"
                                />
                            )}
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">
                                    Author: {firstName} {lastName}
                                </p>
                                {editMode[comment._id] ? (
                                    <div>
                                        <textarea
                                            value={editContent[comment._id]}
                                            onChange={(e) => handleEditChange(comment._id, e.target.value)}
                                            className="border p-2 rounded mb-4 w-full"
                                        />
                                        <button
                                            onClick={() => handleSaveEdit(comment._id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <p>{comment.content}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center mt-1">
                            <button
                                onClick={() => handleReply(comment._id)}
                                className="text-blue-500 text-xs mr-2"
                            >
                                Reply
                            </button>
                            {comment.author._id === user._id && (
                                <>
                                    <FaEdit className="text-gray-500 text-xs mr-2 cursor-pointer" onClick={() => handleEditComment(comment._id, comment.content)} />
                                    <FaTrash className="text-red-500 text-xs cursor-pointer" onClick={() => handleDeleteComment(comment._id)} />
                                </>
                            )}
                        </div>
                        {selectedCommentId === comment._id && (
                            <CreateReply postId={postId} commentId={comment._id} />
                        )}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 mt-2">
                                <CommentList comments={comment.replies} postId={postId} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CommentList;
