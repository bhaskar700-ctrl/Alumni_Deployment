import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchEventById, selectEventById } from "../../redux/store/eventSlice";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const event = useSelector(state => selectEventById(state, eventId));
  const { status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    if (event) {
      console.log('Event image URL:', event.imageUrl); // Debug log
    }
  }, [event]);

  const handleGoBack = () => {
    navigate(-1); // Navigating back
  };

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold my-4">{error}</div>
    );
  }

  if (status === "loading" || !event) {
    return (
      <div className="text-center text-gray-500 font-semibold my-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="border-2 border-sky-500 max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-3/5 xl:w-3/5 order-2 lg:order-1">
          <h1 className="text-3xl font-bold my-4 text-blue-600">
            {event.title}
          </h1>

          <div className="mb-4">
            <p className="text-lg font-semibold">Description:</p>
            <p className="mt-1 text-gray-700">{event.description}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">Location:</p>
            <p className="mt-1 text-gray-700">{event.location}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">Start Date:</p>
            <p className="mt-1 text-gray-700">
              {new Date(event.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">End Date:</p>
            <p className="mt-1 text-gray-700">
              {event.endDate
                ? new Date(event.endDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="w-full lg:w-2/5 xl:w-2/5 order-1 lg:order-2 mb-6 lg:mb-0">
          <img
            src={event.imageUrl}
            alt="event"
            className="w-full object-cover object-center object-fill h-full"
          />
        </div>
      </div>
      <button onClick={handleGoBack} className="absolute top-4 right-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
    </div>
  );
};

export default EventDetailsPage;
