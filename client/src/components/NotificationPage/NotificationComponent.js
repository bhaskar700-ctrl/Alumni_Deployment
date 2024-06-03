import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../../redux/store/notificationSlice'; // Adjust the path according to your project structure
import { Link } from 'react-router-dom';

const NotificationsComponent = () => {
    const dispatch = useDispatch();
    const { notifications, loading, error } = useSelector((state) => state.notifications);
    const userId = useSelector((state) => state.auth.user.id); // Adjust according to your auth state structure

    useEffect(() => {
        dispatch(fetchNotifications(userId));
    }, [dispatch, userId]);

    const handleMarkAsRead = (notificationId) => {
        dispatch(markNotificationAsRead(notificationId));
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    if (loading) return <div className="text-center py-6">Loading...</div>;
    if (error) return <div className="text-center text-red-600 py-6">Error: {error.message}</div>;

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl text-center font-semibold mb-6">Notifications</h2>
            <ul className="space-y-4">
                {notifications.map((notification) => (
                    <li 
                        key={notification._id} 
                        className="p-4 rounded-md text-white transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: getRandomColor() }}
                    >
                        <Link
                            to={notification.link} // Assuming `link` contains the URL for navigation
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-white hover:underline"
                        >
                            <p className="text-lg font-medium">{notification.message}</p>
                        </Link>
                        <p className="text-gray-200 text-sm mt-2">{new Date(notification.date).toLocaleString()}</p>
                        {!notification.read && (
                            <button 
                                onClick={() => handleMarkAsRead(notification._id)} 
                                className="mt-2 text-white hover:underline focus:outline-none"
                                aria-label={`Mark notification from ${new Date(notification.date).toLocaleString()} as read`}
                            >
                                Mark as Read
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsComponent;
