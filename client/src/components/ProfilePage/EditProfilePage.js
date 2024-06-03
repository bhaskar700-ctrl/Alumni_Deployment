import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../../redux/store/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile } = useSelector(state => state.user);
    const token = useSelector(state => state.auth.token); // Fetch token from the auth state
    const apiUrl = process.env.REACT_APP_BACKEND_URL; // Using environment variable for API base URL
    const [formData, setFormData] = useState({
        personalDetails: {
            firstName: '',
            lastName: '',
            profilePicture: ''
        },
        contactInfo: {
            email: '',
            phone: '',
            address: ''
        },
        educationHistory: [{
            institutionName: '',
            degree: '',
            department: '',
            programme: '',
            yearOfGraduation: '',
            activities: ''
        }],
        workExperience: [{
            companyName: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            skills: ''
        }],
        roleDetails: {
            departmentManaged: '',
            permissions: '',
            department: '',
            title: '',
            coursesTaught: '',
            researchInterests: ''
        }
    });
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');

    useEffect(() => {
        if (!profile) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, profile]);

    useEffect(() => {
        if (profile) {
            setFormData({
                ...profile,
                personalDetails: {
                    firstName: profile.personalDetails.firstName || '',
                    lastName: profile.personalDetails.lastName || '',
                    profilePicture: profile.personalDetails.profilePicture || ''
                },
                contactInfo: {
                    email: profile.contactInfo.email || '',
                    phone: profile.contactInfo.phone || '',
                    address: profile.contactInfo.address || ''
                },
                educationHistory: profile.educationHistory.length > 0 ? profile.educationHistory : [{
                    institutionName: '',
                    degree: '',
                    department: '',
                    programme: '',
                    yearOfGraduation: '',
                    activities: ''
                }],
                workExperience: profile.workExperience.length > 0 ? profile.workExperience : [{
                    companyName: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    skills: ''
                }],
                roleDetails: {
                    departmentManaged: profile.roleDetails.departmentManaged || '',
                    permissions: profile.roleDetails.permissions || '',
                    department: profile.roleDetails.department || '',
                    title: profile.roleDetails.title || '',
                    coursesTaught: profile.roleDetails.coursesTaught || '',
                    researchInterests: profile.roleDetails.researchInterests || ''
                }
            });
        }
    }, [profile]);

    const handleChange = (e, section, index) => {
        const { name, value } = e.target;

        if (section) {
            if (index !== undefined) {
                setFormData(prevState => ({
                    ...prevState,
                    [section]: prevState[section].map((item, idx) =>
                        idx === index ? { ...item, [name]: value } : item
                    )
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    [section]: {
                        ...prevState[section],
                        [name]: value
                    }
                }));
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleNestedChange = (e, section, index, field) => {
        const updatedSection = formData[section].map((item, idx) => {
            if (idx === index) {
                return { ...item, [field]: e.target.value };
            }
            return item;
        });

        setFormData({ ...formData, [section]: updatedSection });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileData = new FormData();
            fileData.append('profilePicture', file);

            try {
                const response = await axios.post(`${apiUrl}/api/users/upload`, fileData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}` // Include token in headers
                    }
                });
                const imageUrl = response.data.url;
                setUploadedFileUrl(imageUrl);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit called');
        console.log('formData:', formData);

        const updatedFormData = {
            ...formData,
            personalDetails: {
                ...formData.personalDetails,
                profilePicture: uploadedFileUrl || formData.personalDetails.profilePicture
            }
        };

        const result = await dispatch(updateUserProfile(updatedFormData));
        if (updateUserProfile.fulfilled.match(result)) {
            const userId = result.payload.profile._id; // Get user ID from the result payload
            navigate(`/profile/${userId}`); // Navigate to the profile page with the user ID
        } else {
            console.error('Update failed:', result);
        }
    };

    return (
        <div className="container mt-6 mb-6 border-2 border-sky-400 mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Details */}
                    <div>
                        <label className="block mb-2 font-semibold">First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.personalDetails.firstName}
                            onChange={e => handleChange(e, 'personalDetails')}
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold">Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.personalDetails.lastName}
                            onChange={e => handleChange(e, 'personalDetails')}
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold">Profile Picture URL:</label>
                        <input
                            type="text"
                            name="profilePicture"
                            value={formData.personalDetails.profilePicture}
                            onChange={e => handleChange(e, 'personalDetails')}
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            disabled={!!uploadedFileUrl} // Disable if file is uploaded
                        />
                        <label className="block mb-2 font-semibold">Upload Profile Picture:</label>
                        <input
                            type="file"
                            name="profilePictureFile"
                            onChange={handleFileChange}
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            disabled={!!formData.personalDetails.profilePicture} // Disable if URL is provided
                        />
                    </div>
                </div>
                {/* Additional personal details fields can be added here */}

                {/* Contact Info */}
                <div>
                    <label className="block mb-2 font-semibold">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.contactInfo.email}
                        onChange={e => handleChange(e, 'contactInfo')}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Phone:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.contactInfo.phone}
                        onChange={e => handleChange(e, 'contactInfo')}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.contactInfo.address}
                        onChange={e => handleChange(e, 'contactInfo')}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>
                {/* Additional contact info fields can be added here */}

                {/* Education History */}
                {formData.educationHistory.map((education, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold mb-2">Education History {index + 1}</h3>
                        <div>
                            <label className="block mb-2 font-semibold">Institution Name:</label>
                            <input
                                type="text"
                                name="institutionName"
                                value={education.institutionName || ''}
                                onChange={e => handleNestedChange(e, 'educationHistory', index, 'institutionName')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Degree:</label>
                            <input
                                type="text"
                                name="degree"
                                value={education.degree || ''}
                                onChange={e => handleNestedChange(e, 'educationHistory', index, 'degree')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Department:</label>
                            <input
                                type="text"
                                name="department"
                                value={education.department || ''}
                                onChange={e => handleNestedChange(e, 'educationHistory', index, 'department')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Programme:</label>
                            <input
                                type="text"
                                name="programme"
                                value={education.programme || ''}
                                onChange={e => handleNestedChange(e, 'educationHistory', index, 'programme')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Year of Graduation:</label>
                            <input
                                type="text"
                                name="yearOfGraduation"
                                value={education.yearOfGraduation || ''}
                                onChange={e => handleNestedChange(e, 'educationHistory', index, 'yearOfGraduation')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Activities:</label>
                            <input
                                type="text"
                                name="activities"
                                value={education.activities || ''}
                                onChange={e => handleNestedChange(e, 'educationHistory', index, 'activities')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                ))}

                {/* Work Experience */}
                {formData.workExperience.map((work, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold mb-2">Work Experience {index + 1}</h3>
                        <div>
                            <label className="block mb-2 font-semibold">Company Name:</label>
                            <input
                                type="text"
                                name="companyName"
                                value={work.companyName || ''}
                                onChange={e => handleNestedChange(e, 'workExperience', index, 'companyName')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Position:</label>
                            <input
                                type="text"
                                name="position"
                                value={work.position || ''}
                                onChange={e => handleNestedChange(e, 'workExperience', index, 'position')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Start Date:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={work.startDate || ''}
                                onChange={e => handleNestedChange(e, 'workExperience', index, 'startDate')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">End Date:</label>
                            <input
                                type="date"
                                name="endDate"
                                value={work.endDate || ''}
                                onChange={e => handleNestedChange(e, 'workExperience', index, 'endDate')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Description:</label>
                            <textarea
                                name="description"
                                value={work.description || ''}
                                onChange={e => handleNestedChange(e, 'workExperience', index, 'description')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Skills:</label>
                            <input
                                type="text"
                                name="skills"
                                value={work.skills || ''}
                                onChange={e => handleNestedChange(e, 'workExperience', index, 'skills')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                ))}

                {/* Role Details */}
                {formData.userType === 'admin' && (
                    <div>
                        <label className="block mb-2 font-semibold">Department Managed:</label>
                        <input
                            type="text"
                            name="departmentManaged"
                            value={formData.roleDetails.departmentManaged || ''}
                            onChange={e => handleChange(e, 'roleDetails')}
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                        />
                        <label className="block mb-2 font-semibold">Permissions:</label>
                        <input
                            type="text"
                            name="permissions"
                            value={formData.roleDetails.permissions || ''}
                            onChange={e => handleChange(e, 'roleDetails')}
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                )}
                {formData.userType === 'faculty' && (
                    <>
                        <div>
                            <label className="block mb-2 font-semibold">Department:</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.roleDetails.department || ''}
                                onChange={e => handleChange(e, 'roleDetails')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.roleDetails.title || ''}
                                onChange={e => handleChange(e, 'roleDetails')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Courses Taught:</label>
                            <input
                                type="text"
                                name="coursesTaught"
                                value={formData.roleDetails.coursesTaught || ''}
                                onChange={e => handleChange(e, 'roleDetails')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Research Interests:</label>
                            <input
                                type="text"
                                name="researchInterests"
                                value={formData.roleDetails.researchInterests || ''}
                                onChange={e => handleChange(e, 'roleDetails')}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:bg-blue-600 transition duration-300"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default EditProfilePage;
