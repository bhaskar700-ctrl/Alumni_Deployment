import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, listChattedUsers, setActiveChat, toggleShowAllUsers } from '../../redux/store/chattingSlice';

const mediaBaseUrl = process.env.REACT_APP_BACKEND_URL;

function Sidebar({ currentUser }) {
    const dispatch = useDispatch();
    const users = useSelector(state => state.chatting.users);
    const chattedUsers = useSelector(state => state.chatting.chattedUsers);
    const showAllUsers = useSelector(state => state.chatting.showAllUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const { profile: userProfile, error, status } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(listChattedUsers()).then(response => {
            console.log('Fetched chatted users:', response.payload);
        });
        if (showAllUsers) {
            dispatch(fetchUsers()).then(response => {
                console.log('Fetched all users:', response.payload);
            });
        }
    }, [dispatch, showAllUsers]);

    const handleUserClick = (user) => {
        console.log('User clicked:', user);
        dispatch(setActiveChat(user));
    };

    const filteredUsers = (showAllUsers ? users : chattedUsers).filter(user =>
        user?.personalDetails &&
        (user.personalDetails.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.personalDetails.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getProfilePicture = (profilePicture) => {
        return profilePicture ? `${mediaBaseUrl}${profilePicture}` : '/images/default-avatar.png';
    };

    return (
        <div className="w-1/4 bg-gray-800 p-2 border-r border-gray-200 flex flex-col">
            {/* Current User Profile */}
            <div className="flex items-center p-4 mb-4 bg-gray-500 shadow rounded">
                <img src={getProfilePicture(userProfile?.personalDetails?.profilePicture)} alt="avatar" className="w-12 border-2 border-gray-700 h-12 rounded-full mr-4" />
                <div>
                    <div className="text-lg font-bold">{currentUser?.personalDetails?.firstName} {currentUser?.personalDetails?.lastName}</div>
                    <div className="text-sm text-white">My Profile</div>
                </div>
            </div>

            <h2 className="text-xl text-white font-bold mb-4">Chats</h2>
            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                placeholder="Search users"
            />
            <button
                onClick={() => dispatch(toggleShowAllUsers())}
                className="w-full p-2 mb-4 bg-blue-500 text-white rounded"
            >
                {showAllUsers ? 'Show Chatted Users' : 'Show All Users'}
            </button>
            <ul className="flex-grow overflow-y-auto">
                {filteredUsers.map(user => (
                    user?._id !== currentUser?._id && (
                        <li
                            key={user?._id}
                            className="flex items-center p-2 pb-2 text-white cursor-pointer border-b hover:bg-slate-600 border-gray-700"
                            onClick={() => handleUserClick(user)}
                        >
                            <img 
                                src={getProfilePicture(user?.personalDetails?.profilePicture)} 
                                alt={user?.personalDetails?.firstName} 
                                className="w-10 border-2 border-gray-700 h-10 rounded-full mr-2" 
                            />
                            <div>
                                <div className="font-bold">{user?.personalDetails?.firstName} {user?.personalDetails?.lastName}</div>
                            </div>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
