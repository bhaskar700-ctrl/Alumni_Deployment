import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword, clearState } from '../../redux/store/passwordResetSlice';

const PasswordResetPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, success, error } = useSelector((state) => state.passwordReset);
  const [newPassword, setNewPassword] = useState('');
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    if (!token) {
      setTokenError('No token provided.');
    } else {
      setTokenError('');
    }
  }, [token]);

  useEffect(() => {
    if (success) {
      dispatch(clearState());
      navigate('/login');
    }
  }, [success, dispatch, navigate]);

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!token) {
      setTokenError('No token provided.');
      return;
    }
    dispatch(resetPassword({ token, newPassword }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-full max-w-md px-4 mx-auto lg:w-1/2">
        <div className="w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
          <div className="mb-4 text-center">
            <h1 className="text-3xl text-gray-700">Reset Password</h1>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Reset Password'}
            </button>
          </form>
          {tokenError && <p className="mt-4 text-red-600">{tokenError}</p>}
          {error && <p className="mt-4 text-red-600">{error.message ? error.message : error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
