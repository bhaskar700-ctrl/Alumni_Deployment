import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const PostDetailsPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/forums/post/${postId}`);
                setPost(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="post-details-page p-8">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p>{post.content}</p>
            {post.photo && <img src={`${apiUrl}${post.photo}`} alt="Post" />}
            {post.video && <video src={`${apiUrl}${post.video}`} controls />}
        </div>
    );
};

export default PostDetailsPage;
