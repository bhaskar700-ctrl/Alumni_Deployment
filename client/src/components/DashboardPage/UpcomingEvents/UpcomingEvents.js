import React from 'react';
// Import icons or additional components if needed

const UpcomingEvents = () => {
    // Placeholder data, replace with actual data fetching logic
    const events = [
        { 
            title: 'Spring Networking Event', 
            date: 'April 22, 2024',
            description: 'A chance to meet and connect with fellow alumni in the tech industry.' 
        },
        { 
            title: 'Annual Fundraiser Gala', 
            date: 'May 15, 2024',
            description: 'Join us for our annual fundraising event to support student scholarships.' 
        },
        // More events...
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="event-item">
                        <h4 className="event-title font-medium">{event.title}</h4>
                        <p className="event-date text-sm text-gray-500">{event.date}</p>
                        <p className="event-description text-gray-700">{event.description}</p>
                        <a href="/events" className="text-indigo-600 hover:text-indigo-800">Learn more</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingEvents;
