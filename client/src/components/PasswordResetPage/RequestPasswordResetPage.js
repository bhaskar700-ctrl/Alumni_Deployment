import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordReset, clearState } from '../../redux/store/passwordResetSlice';

const RequestPasswordResetPage = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.passwordReset);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (success) {
      dispatch(clearState());
      alert('Check your email for the reset link.');
    }
  }, [success, dispatch]);

  const handleRequestReset = () => {
    dispatch(requestPasswordReset(email));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center w-full max-w-md px-4 mx-auto lg:w-1/2">
        <div className="w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
          <div className="mb-4 text-center">
            <h1 className="text-3xl text-gray-700">Request Password Reset</h1>
            <p className="text-sm text-gray-400">Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleRequestReset(); }} className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Request Reset'}
            </button>
          </form>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;
