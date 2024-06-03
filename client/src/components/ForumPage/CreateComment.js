import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComment } from '../../redux/store/forumSlice';

const CreateComment = ({ postId }) => {
    const [content, setContent] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = () => {
        console.log(content);
        dispatch(createComment({ postId, content }));
        setContent('');
        if (!content.trim()) {
            alert("Comment content cannot be empty.");
            return;
        }
    };

    return (
        <div className="mt-4">
            <textarea
                className="w-full p-2 border rounded"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Add a comment..."
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSubmit}
            >
                Comment
            </button>
        </div>
    );
};

export default CreateComment;
