import React from 'react';
// Import icons or additional components if needed
// For demonstration purposes, I'm using placeholder icons. Replace 'placeholder-icon' with your actual icon paths or components.

const QuickLinks = () => {
    // Placeholder links data
    const links = [
        { name: 'Update Profile', icon: 'placeholder-icon', href: '/update-profile' },
        { name: 'Alumni Directory', icon: 'placeholder-icon', href: '/directory' },
        { name: 'Make a Donation', icon: 'placeholder-icon', href: '/donate' },
        { name: 'Event Calendar', icon: 'placeholder-icon', href: '/events' },
        // Add more links as needed
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
                {links.map((link, index) => (
                    <a key={index} href={link.href} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        {/* Replace 'img' with actual icons */}
                        <img src={link.icon} alt="" className="w-6 h-6" /> 
                        <span className="font-medium text-gray-700">{link.name}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default QuickLinks;
