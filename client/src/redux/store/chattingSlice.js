import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/messages`
});

export const fetchUsers = createAsyncThunk(
    'chatting/fetchUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState();
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axiosInstance.get('/users');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchConversations = createAsyncThunk(
    'chatting/fetchConversations',
    async (otherUserId, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState();
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axiosInstance.get(`/conversation/${otherUserId}`);
            console.log('fetchConversations response:', response.data);
            return response.data;
        } catch (error) {
            console.error('fetchConversations error:', error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chatting/sendMessage',
    async ({ receiverId, content, file }, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState();
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const formData = new FormData();
            formData.append('receiverId', receiverId);
            if (content) formData.append('content', content);
            if (file) formData.append('file', file);
  
            const response = await axiosInstance.post('/send', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response from sendMessage:', response.data.data); // Log the response
            return response.data.data; // Return the message data including the sender
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchConversationsList = createAsyncThunk(
    'chatting/fetchConversationsList',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState();
            const config = token ? {
                headers: { 'Authorization': `Bearer ${token}` }
            } : {};
            const response = await axiosInstance.get('/list', config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const markMessageAsRead = createAsyncThunk(
    'chatting/markMessageAsRead',
    async (messageId, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState();
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axiosInstance.post(`/messages/${messageId}/read`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const editMessage = createAsyncThunk(
  'chatting/editMessage',
  async ({ messageId, content }, { getState, rejectWithValue }) => {
      try {
          const { auth: { token } } = getState();
          if (token) {
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          const response = await axiosInstance.put(`/messages/${messageId}`, { content });
          return response.data;  // Ensure this includes sender and receiver details
      } catch (error) {
          return rejectWithValue(error.response.data);
      }
  }
);

export const deleteMessage = createAsyncThunk(
  'chatting/deleteMessage',
  async (messageId, { getState, rejectWithValue }) => {
      try {
          const { auth: { token } } = getState();
          if (token) {
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          const response = await axiosInstance.delete(`/messages/${messageId}`);
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response.data);
      }
  }
);

export const listChattedUsers = createAsyncThunk(
    'chatting/listChattedUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState();
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axiosInstance.get('/chatted-users');
            return response.data.map(user => user.userDetails);  // Extract userDetails from response
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    users: [],
    chattedUsers: [],
    conversations: [],
    activeChat: null,
    showAllUsers: false,
    status: 'idle',
    error: null,
};

const chattingSlice = createSlice({
    name: 'chatting',
    initialState,
    reducers: {
        toggleShowAllUsers(state) {
            state.showAllUsers = !state.showAllUsers;
        },
        setActiveChat(state, action) {
            state.activeChat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchConversations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('Fetched conversations:', action.payload);
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(sendMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('Sent message:', action.payload);
                state.conversations.push(action.payload); // Add the new message to the state
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchConversationsList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchConversationsList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.conversations = action.payload;
            })
            .addCase(fetchConversationsList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(markMessageAsRead.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(markMessageAsRead.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { messageId, userId } = action.payload;
                const message = state.conversations.find(msg => msg._id === messageId);
                if (message) {
                    message.readBy.push(userId);
                }
            })
            .addCase(markMessageAsRead.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(editMessage.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(editMessage.fulfilled, (state, action) => {
              state.status = 'succeeded';
              const updatedMessage = action.payload;
              const index = state.conversations.findIndex(msg => msg._id === updatedMessage._id);
              if (index !== -1) {
                  state.conversations[index] = updatedMessage;
              }
          })
          .addCase(editMessage.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload;
          })
            .addCase(deleteMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const messageId = action.payload;
                state.conversations = state.conversations.filter(msg => msg._id !== messageId);
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(listChattedUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(listChattedUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chattedUsers = action.payload;
            })
            .addCase(listChattedUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { toggleShowAllUsers, setActiveChat } = chattingSlice.actions;

export default chattingSlice.reducer;
