// src/CreatePost.js
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../redux/store/forumSlice'; // Adjust the import path if necessary
import PhotoUpload from './PhotoUpload';
import VideoUpload from './VideoUpload';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState(null);
    const [video, setVideo] = useState(null);
    const [showPostForm, setShowPostForm] = useState(false);
    const postFormRef = useRef(null);
    const dispatch = useDispatch();
    const { status, error } = useSelector(state => state.forum);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        if (photo) {
            formData.append('file', photo);
        }
        if (video) {
            formData.append('file', video);
        }
        dispatch(createPost(formData))
            .unwrap()
            .then((response) => {
                console.log('Post created successfully:', response);
                setContent('');
                setPhoto(null);
                setVideo(null);
                setShowPostForm(false); // Close the post form overlay after submission
            })
            .catch((err) => {
                console.error('Error creating post:', err);
            });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (postFormRef.current && !postFormRef.current.contains(event.target)) {
                setShowPostForm(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            {showPostForm && (
                <div className="post-form-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div ref={postFormRef} className="post-form bg-white p-10 h-4/5 rounded-lg relative">
                        <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowPostForm(false)}>
                            &#10005;
                        </button>
                        <form onSubmit={handleSubmit} className="w-full h-full">
                            <PhotoUpload onPhotoChange={setPhoto} />
                            <VideoUpload onVideoChange={setVideo} />
                            <textarea
                                className="border p-2 rounded mb-4 w-full h-2/5"
                                placeholder="Write something..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            ></textarea>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                Post
                            </button>
                        </form>
                        {status === 'loading' && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                    </div>
                </div>
            )}
            <div className="create-post-textarea">
                <textarea
                    className="border p-2 rounded w-full mb-4"
                    placeholder="Write something..."
                    onClick={() => setShowPostForm(true)} // Show the post form when clicked
                ></textarea>
               
            </div>
        </div>
    );
};

export default CreatePost;
