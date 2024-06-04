import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, selectAllEvents, deleteEvent } from '../../redux/store/eventSlice'; // Adjust import path
import { Link } from 'react-router-dom';

const EventListPage = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const { status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(eventId))
        .unwrap()
        .then(() => {
          console.log('Event deleted successfully');
        })
        .catch((error) => {
          console.error('Failed to delete event:', error);
        });
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl text-center font-bold mb-6">Events</h2>
      <Link to="/events/create" className="mb-4 block text-center bg-blue-500 text-white py-2 rounded">Create Event</Link>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event._id} className="bg-white p-4 rounded shadow-md">
            <div className="h-48 w-full">
              <img
                className="w-full h-full object-cover rounded"
                alt="event"
                src={event.imageUrl}
              />
            </div>
            <h1 className="text-2xl font-medium mt-2">{event.title}</h1>
            <p className="text-gray-600 text-sm mt-1">{event.description}</p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
              <Link to={`/events/${event._id}`} className="bg-[#f02e65] text-white py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2 text-center">
                View Details
              </Link>
              <Link to={`/events/edit/${event._id}`} className="bg-gray-100 text-gray-700 py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2 text-center">
                Edit
              </Link>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 text-white py-2 px-4 rounded text-center"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventListPage;
