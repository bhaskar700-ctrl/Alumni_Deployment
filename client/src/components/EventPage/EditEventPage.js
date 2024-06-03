import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventById, updateEvent } from '../../redux/store/eventSlice';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { event, status, error } = useSelector((state) => state.events);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    file: null,
  });

  useEffect(() => {
    if (!event || event._id !== eventId) {
      dispatch(fetchEventById(eventId));
    } else {
      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        startDate: event.startDate ? event.startDate.substring(0, 10) : '',
        endDate: event.endDate ? event.endDate.substring(0, 10) : '',
        file: null,
      });
    }
  }, [dispatch, eventId, event]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    // Log formData for debugging
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    dispatch(updateEvent({ eventId, eventData: data }))
      .unwrap()
      .then(() => navigate('/events'))
      .catch((error) => {
        console.error('Failed to update event:', error);
        // Additional logging to see the exact error response from the server
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        }
      });
  };

  const renderError = (error) => {
    if (typeof error === 'string') {
      return error;
    } else if (typeof error === 'object' && error.message) {
      return error.message;
    } else {
      return 'An unknown error occurred';
    }
  };

  if (status === 'loading') return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{renderError(error)}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 shadow-lg border border-indigo-200 rounded-lg bg-white relative">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Edit Event</h2>
      <button onClick={handleGoBack} className="absolute top-4 left-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"></textarea>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2" />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2" />
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" name="file" id="file" onChange={handleFileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2" />
          {formData.file && <p className="mt-2 text-sm text-gray-600">{formData.file.name}</p>}
        </div>
        <button type="submit" className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
