import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../../redux/store/eventSlice'; // Adjust import path
import { Link } from 'react-router-dom';

const DashBoardEvents = () => {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Assuming events are sorted by date in descending order (latest first)
  const latestEvent = events.length > 0 ? events[0] : null;

  return (
    <div>
      <h2 className="text-xl text-center text-cyan-50 font-bold ">Latest Event</h2>
      {latestEvent ? (
        <div className="py-3 flex justify-center">
          <div className="bg-white p-4 rounded shadow-md w-fit">
            <div style={{ height: "200px", width: "300px" }}>
              <img
                className="w-full h-full object-cover rounded"
                alt="event"
                src="https://miro.medium.com/v2/resize:fit:900/1*cRSs6Icwnk2qQ9yLzEi8jg.png" // Replace with a placeholder image URL
              />
            </div>
            <h1 className="text-2xl font-medium mt-2">{latestEvent.title}</h1>
            <p className="text-gray-600 text-sm mt-1">{latestEvent.description}</p>
            <div className="mt-4">
              <Link to={`/events/${latestEvent._id}`} className="bg-[#f02e65] text-white py-2 px-4 rounded mr-2">
                View Details
              </Link>
            
            </div>
          </div>
        </div>
      ) : (
        <div>No events available</div>
      )}
    </div>
  );
};

export default DashBoardEvents;
