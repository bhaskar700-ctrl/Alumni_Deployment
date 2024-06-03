import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchConversationsList, setActiveChat, listChattedUsers } from '../../redux/store/chattingSlice';
import { fetchUser } from '../../redux/store/authSlice'; // Import the fetchUser action from the authSlice
import ChatWindow from './ChatWindow';
import Sidebar from './Sidebar';

const ChatPage = () => {
    const dispatch = useDispatch();
    const activeChat = useSelector(state => state.chatting.activeChat);
    const currentUser = useSelector(state => state.auth.user);

    useEffect(() => {
        if (!currentUser) {
            dispatch(fetchUser()); // Fetch current user details if not already available
        }
        dispatch(listChattedUsers());
        dispatch(fetchConversationsList());
    }, [dispatch, currentUser]);

    console.log('Active chat:', activeChat);
    console.log('Current user:', currentUser);

    return (
        <div className="flex h-screen my-4 border-2 rounded-lg border-sky-700">
            <Sidebar 
                currentUser={currentUser} 
            />
            {activeChat ? (
                <ChatWindow conversation={activeChat} currentUser={currentUser} />
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-100">
                    Please select a chat
                </div>
            )}
        </div>
    );
};

export default ChatPage;
