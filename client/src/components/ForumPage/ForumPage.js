import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost, searchPosts } from "../../redux/store/forumSlice";
import CreatePost from "./CreatePost"; // Component for creating a new post
import PostList from "./PostList"; // Component for displaying the list of posts
import ActivityFeed from "./ActivityFeed";
import UserProfile from "./UserProfile";

const ForumPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const { posts, status, error } = useSelector((state) => state.forum);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleCreatePost = (data) => {
        const formData = new FormData();
        formData.append('content', data.content);
        if (data.photo) {
            formData.append('file', data.photo);
        }
        if (data.video) {
            formData.append('file', data.video);
        }
        dispatch(createPost(formData));
    };

    const handleSearch = () => {
        dispatch(searchPosts(searchTerm));
    };

    return (
        <>
            <div className="flex w-full justify-around flex-wrap">
                <div className="w-full md:w-1/6 mb-4 md:mb-0">
                    <UserProfile />
                </div>
                <div className="forum-page shadow-lg shadow-cyan-600 w-full md:w-2/4 rounded-xl border-2 bg-gray-100 min-h-screen p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Forum</h1>
                        <div className="search-bar flex items-center">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border p-2 rounded mr-4"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <CreatePost onCreate={handleCreatePost} />
                    {status === "loading" && <p>Loading posts...</p>}
                    {error && <p>Error fetching posts: {error}</p>}
                    <PostList posts={posts} />
                </div>
                <div className="hidden md:block w-full md:w-1/6">
                    <ActivityFeed />
                </div>
            </div>
        </>
    );
};

export default ForumPage;
