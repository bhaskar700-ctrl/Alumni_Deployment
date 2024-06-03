import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers, fetchUserById, markFavorite } from '../../redux/store/userDirectorySlice';

const UserDirectoryPage = () => {
  const dispatch = useDispatch();
  const { users, status, error, totalUsers, departments, years } = useSelector((state) => state.userDirectory);
  const [filters, setFilters] = useState({
    userType: '',
    department: '',
    programme: '',
    year: ''
  });

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleUserClick = (userId) => {
    dispatch(fetchUserById(userId));
  };

  const handleFavoriteClick = (userId, favoriteUserId) => {
    dispatch(markFavorite({ userId, favoriteUserId }));
  };

  const getProfilePictureUrl = (profilePicture) => {
    if (profilePicture.startsWith('http') || profilePicture.startsWith('https')) {
      return profilePicture;
    }
    return `${process.env.REACT_APP_BACKEND_URL}${profilePicture}`;
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div>
      <div className='mb-15'>
        {/* Filter dropdowns */}
        <select name="userType" value={filters.userType} onChange={handleFilterChange}>
          <option value="">Select User Type</option>
          <option value="alumni">Alumni</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        {/* Conditionally render additional filters for Alumni */}
        {filters.userType === 'alumni' && (
          <>
            <select name="year" value={filters.year} onChange={handleFilterChange}>
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select name="department" value={filters.department} onChange={handleFilterChange}>
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </>
        )}
        {/* Add more filter dropdowns for programme */}
      </div>

      {/* Add space between filter and user cards */}
      <div className="mb-8"></div>

      {/* Display users */}
      <div className="grid grid-cols-1 mt-15 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map(user => {
          const profilePictureUrl = user.personalDetails.profilePicture 
            ? getProfilePictureUrl(user.personalDetails.profilePicture) 
            : '/images/default-avatar.png';

          return (
            <div key={user._id} className="bg-white border border-gray-200 rounded-lg shadow p-6 hover:bg-gray-200">
              <Link to={`/user-directory/profile/${user._id}`} className="block" onClick={() => handleUserClick(user._id)}>
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg mx-auto"
                  src={profilePictureUrl}
                  alt={`Avatar of ${user.personalDetails.firstName} ${user.personalDetails.lastName}`}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-avatar.png'; }}
                />
                <h5 className="mb-1 text-xl font-medium text-gray-900 text-center">
                  {user.personalDetails.firstName} {user.personalDetails.lastName}
                </h5>
                <p className="text-sm text-gray-500 text-center">
                  {user.userType}
                </p>
              </Link>
              {/* Add LinkedIn and Message buttons */}
              {user.userType === 'alumni' && (
                <div className="flex justify-center mt-4 space-x-3">
                  <a
                    href="https://www.linkedin.com/in/bhaskar-sonowal-251166179/"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    LinkedIn
                  </a>

                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Message
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Display total users */}
      <div className="mt-6 flex justify-center">
        <p>Total Users: {totalUsers}</p>
      </div>
    </div>
  );
};

export default UserDirectoryPage;
