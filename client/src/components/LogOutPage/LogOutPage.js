// src/components/LogoutPage/LogoutPage.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/store/authSlice';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = () => {
      // Clear local storage or any other storage mechanism you're using
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      // Dispatch the logout action
      dispatch(logout());
      
      // Redirect user to the login page or home page
      navigate('/login');
    };

    performLogout();
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <p>Logging out...</p>
        {/* You can place a spinner here */}
      </div>
    </div>
  );
};

export default LogoutPage;
