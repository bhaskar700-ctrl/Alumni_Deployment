import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { replyToComment } from '../../redux/store/forumSlice';

const CreateReply = ({ postId, commentId }) => {
    const [content, setContent] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert("Reply content cannot be empty.");
            return;
        }
        dispatch(replyToComment({ postId, commentId, content }));
        setContent('');
    };

    return (
        <div className="mt-4">
            <textarea
                className="w-full p-2 border rounded"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Add a reply..."
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSubmit}
            >
                Reply
            </button>
        </div>
    );
};

export default CreateReply;
