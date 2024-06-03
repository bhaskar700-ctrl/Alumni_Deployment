import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const CTASection = () => {
    return (
        <section className="text-center p-8">
            <h2 className="text-3xl font-bold">Join Our Community</h2>
            <Link to="/signup"> {/* Wrap the button in a Link component */}
                <button className="bg-blue-500 text-white mt-4 px-6 py-2 rounded-md">Sign Up Now</button>
            </Link>
        </section>
    );
};

export default CTASection;
