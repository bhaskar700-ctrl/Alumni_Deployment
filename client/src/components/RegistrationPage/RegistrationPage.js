import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/store/userSlice';

const RegisterForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        userType: '',
        userId: '',
        email: '',
        dateOfBirth: '',
        password: ''
    });
    const { status, error } = useSelector(state => state.user);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(registerUser(formData));
    };

    return (
        <div className='flex justify-center border-2 items-center h-screen' style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url("https://adaptnet.aua.gr/images/Images/TEZU/TU_Photo.jpg")'}}>
            <form onSubmit={handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='userType'>
                        User Type
                    </label>
                    <select
                        className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        name='userType'
                        value={formData.userType}
                        onChange={handleChange}
                        required
                    >
                        <option value=''>Select User Type</option>
                        <option value='student'>Student</option>
                        <option value='alumni'>Alumni</option>
                        <option value='faculty'>Faculty</option>
                        <option value='admin'>Admin</option>
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='userId'>
                        User ID
                    </label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='text'
                        name='userId'
                        value={formData.userId}
                        onChange={handleChange}
                        placeholder='User ID'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                        Email
                    </label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='dateOfBirth'>
                        Date of Birth
                    </label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='date'
                        name='dateOfBirth'
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='mb-6'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                        Password
                    </label>
                    <input
                        className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Password'
                        required
                    />
                </div>
                <div className='flex items-center justify-between'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='submit'
                    >
                        Register
                    </button>
                    {status === 'loading' && <p>Registering...</p>}
                    {status === 'failed' && <p className='text-red-500'>{error}</p>}
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
