import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/store/authSlice'; // Adjust the import path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handleLogin = async (event) => {
        event.preventDefault();
        toast.info('Logging in...', { autoClose: 2000 });

        try {
            const response = await axios.post(`${apiUrl}/api/users/login`, { email, password });
            console.log('Login successful:', response.data);

            // Store the token, user role, and user ID in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.userType); // Assuming the role is userType in your response
            localStorage.setItem('userId', response.data._id); // Assuming _id is the user ID in your response

            // Dispatch the loginSuccess action with the user details
            dispatch(loginSuccess({
                token: response.data.token,
                userType: response.data.userType,
                personalDetails: response.data.personalDetails,
                contactInfo: response.data.contactInfo,
                _id: response.data._id, // Including the user ID
            }));

            // Redirect based on user role
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error occurred';
            if (error.response?.status === 401) {
                toast.error('Incorrect email or password', { autoClose: 3000 });
            } else {
                toast.error(errorMessage, { autoClose: 3000 });
            }
            console.error('Login failed:', errorMessage);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex flex-col justify-center w-full max-w-md px-4 mx-auto lg:w-1/2">
                <ToastContainer />
                <div className="w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
                    <div className="mb-4 text-center">
                        <h1 className="text-3xl text-gray-700">Tezpur University Alumni Connect</h1>
                        <p className="text-sm text-gray-400">Please login to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <input 
                            type="email"
                            name="email" 
                            id="email" 
                            placeholder="Email" 
                            aria-label="Email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <input 
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            aria-label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button 
                            type="submit" 
                            className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <NavLink to="/request-reset-password" className="text-sm text-indigo-600 hover:underline">Forgot password?</NavLink>
                    </div>

                    <div className="text-center mt-2">
                        <NavLink to="/register" className="text-sm text-indigo-600 hover:underline">Don't have an account? Register</NavLink>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 bg-cover" style={{backgroundImage: 'url(/path-to-background-image.jpg)'}}>
                <div className="flex h-full bg-black bg-opacity-25">
                    <div className="m-auto text-center text-white p-8">
                        <h1 className="text-3xl font-bold mb-2">We are more than just a company</h1>
                        <p className="text-lg">
                            Connect, share, and grow with the Tezpur University Alumni Connect.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
