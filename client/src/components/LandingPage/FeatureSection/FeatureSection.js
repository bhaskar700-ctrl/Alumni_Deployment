import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const FeaturesSection = () => {
    const features = [
        {
            title: 'Networking Opportunities',
            description: 'Connect with alumni across the globe and expand your professional network.',
            icon: 'https://upload.wikimedia.org/wikipedia/en/7/78/Community_Network_%28logo%29.png',
            link: '/login', // Add the link for navigation
        },
        {
            title: 'Job Board',
            description: 'Access exclusive job listings and career opportunities.',
            icon: 'https://img.freepik.com/premium-psd/we-are-hiring-job-vacancy-social-media-post-template_504779-82.jpg',
            link: '/login', // Add the link for navigation
        },
        {
            title: 'Event Calendar',
            description: 'Stay updated with alumni events, reunions, and webinars.',
            icon: 'https://t3.ftcdn.net/jpg/04/75/43/42/360_F_475434218_H9iKI1g01Tf7DnGQKVUIaYLpKasHQg3m.jpg',
            link: '/login', // Add the link for navigation
        },
        {
            title: 'Forums',
            description: 'Engage in discussions, share knowledge, and stay connected with the alumni community.',
            icon: 'https://assets.hongkiat.com/uploads/freelancers-why-join-online-forums/online-forum.jpg',
            link: '/login', // Add the link for navigation
        },
        // Add more features as needed
    ];

    return (
        <section className="p-8 bg-white">
            <h2 className="text-3xl font-bold text-center mb-10">Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <Link key={index} to={feature.link} className="hover:no-underline"> {/* Wrap each feature in a Link */}
                        <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-100">
                            <img
                                className="w-full h-auto object-cover"
                                src={feature.icon}
                                alt={feature.title}
                                style={{ width: '350px', height: '250px' }}
                            />
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-700 text-base">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
