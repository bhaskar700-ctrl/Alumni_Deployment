import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/forums`,
});

const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

axiosInstance.interceptors.request.use(
  config => {
    console.log('Request:', config); // Log request
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', response); // Log response
    return response;
  },
  error => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchPosts = createAsyncThunk(
  'forum/fetchPosts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.get('/posts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not fetch posts');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'forum/fetchUserPosts',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.get(`/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not fetch user posts');
    }
  }
);

export const fetchPostCount = createAsyncThunk(
  'forum/fetchPostCount',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/posts/count`);
      return response.data.postCount;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not fetch post count');
    }
  }
);

export const fetchTotalPostCount = createAsyncThunk(
  'forum/fetchTotalPostCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/count`);
      return response.data.totalPostCount;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not fetch total post count');
    }
  }
);

export const createPost = createAsyncThunk(
  'forum/createPost',
  async (postData, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.post('/post', postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not create post');
    }
  }
);

export const socketNewPost = (post) => (dispatch) => {
  dispatch(addPost(post));
};

export const createComment = createAsyncThunk(
  'forum/createComment',
  async ({ postId, content }, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.post(`/post/${postId}/comment`, { content });
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not add comment');
    }
  }
);

export const replyToComment = createAsyncThunk(
  'forum/replyToComment',
  async ({ postId, commentId, content }, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.post(`/post/${postId}/comment/${commentId}/reply`, { content });
      return { postId, commentId, reply: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not reply to comment');
    }
  }
);

export const editPost = createAsyncThunk(
  'forum/editPost',
  async ({ postId, content }, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.put(`/post/${postId}`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not edit post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'forum/deletePost',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      await axiosInstance.delete(`/post/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not delete post');
    }
  }
);

export const likePost = createAsyncThunk(
  'forum/likePost',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      console.log("Sending request to like post with postId:", postId); // Log payload
      const response = await axiosInstance.post(`/post/${postId}/like`);
      console.log("Response from like post:", response.data); // Log response
      return { postId, likes: response.data.likes };
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message); // Log error
      return rejectWithValue(error.response?.data.message || 'Could not like post');
    }
  }
);

export const editComment = createAsyncThunk(
  'forum/editComment',
  async ({ postId, commentId, content }, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.put(`/post/${postId}/comment/${commentId}`, { content });
      return { postId, commentId, content: response.data.content };
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not edit comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'forum/deleteComment',
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      await axiosInstance.delete(`/post/${postId}/comment/${commentId}`);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not delete comment');
    }
  }
);

export const searchPosts = createAsyncThunk(
  'forum/searchPosts',
  async (query, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      setAuthToken(token);
      const response = await axiosInstance.get(`/posts/search`, { params: { query } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || 'Could not search posts');
    }
  }
);

const initialState = {
  posts: [],
  postCount: 0, // Add initial state for postCount
  totalPostCount: 0,
  status: 'idle',
  error: null
};

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    addPost(state, action) {
      state.posts = [action.payload, ...state.posts];
    },
    addCommentToPost(state, action) {
      const { postId, comment } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments.push(comment);
      }
    },
    addReplyToComment(state, action) {
      const { postId, commentId, reply } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        const commentIndex = state.posts[postIndex].comments.findIndex(comment => comment._id === commentId);
        if (commentIndex !== -1) {
          state.posts[postIndex].comments[commentIndex].replies.push(reply);
        }
      }
    },
    updateLikes(state, action) {
      const { postId, likes } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        console.log('Updating likes for post:', postId);
        state.posts[postIndex].likes = likes;
      }
    },
    editPostInState(state, action) {
      const { postId, content } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].content = content;
      }
    },
    deletePostInState(state, action) {
      const postId = action.payload;
      state.posts = state.posts.filter(post => post._id !== postId);
    },
    editCommentInState(state, action) {
      const { postId, commentId, content } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        const commentIndex = state.posts[postIndex].comments.findIndex(comment => comment._id === commentId);
        if (commentIndex !== -1) {
          state.posts[postIndex].comments[commentIndex].content = content;
        }
      }
    },
    deleteCommentInState(state, action) {
      const { postId, commentId } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments = state.posts[postIndex].comments.filter(comment => comment._id !== commentId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch posts';
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user posts';
      })
      .addCase(fetchPostCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.postCount = action.payload; // Update postCount state
      })
      .addCase(fetchPostCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch post count';
      })
      .addCase(fetchTotalPostCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTotalPostCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalPostCount = action.payload; // Update total post count state
      })
      .addCase(fetchTotalPostCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch total post count';
      })
      .addCase(createPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Instead of adding the post here, rely on the socket event to handle this.
        // state.posts.unshift(action.payload.post);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create post';
      })
      .addCase(createComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { postId, comment } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments.push(comment);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not add comment';
      })
      .addCase(replyToComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(replyToComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { postId, commentId, reply } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          const commentIndex = state.posts[postIndex].comments.findIndex(comment => comment._id === commentId);
          if (commentIndex !== -1) {
            state.posts[postIndex].comments[commentIndex].replies.push(reply);
          }
        }
      })
      .addCase(replyToComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not reply to comment';
      })
      .addCase(editPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { _id: postId, content } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].content = content;
        }
      })
      .addCase(editPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not edit post';
      })
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const postId = action.payload;
        state.posts = state.posts.filter(post => post._id !== postId);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not delete post';
      })
      .addCase(likePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { postId, likes } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          console.log('Updating likes in state for post:', postId); // Log state update
          state.posts[postIndex].likes = likes;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not like post';
      })
      .addCase(editComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { postId, commentId, content } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          const commentIndex = state.posts[postIndex].comments.findIndex(comment => comment._id === commentId);
          if (commentIndex !== -1) {
            state.posts[postIndex].comments[commentIndex].content = content;
          }
        }
      })
      .addCase(editComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not edit comment';
      })
      .addCase(deleteComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { postId, commentId } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments = state.posts[postIndex].comments.filter(comment => comment._id !== commentId);
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Could not delete comment';
      })
      .addCase(searchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to search posts';
      });
  },
});

export const {
  addPost,
  addCommentToPost,
  addReplyToComment,
  updateLikes,
  editPostInState,
  deletePostInState,
  editCommentInState,
  deleteCommentInState
} = forumSlice.actions;

export default forumSlice.reducer;
