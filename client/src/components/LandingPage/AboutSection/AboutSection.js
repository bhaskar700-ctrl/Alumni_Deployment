// src/components/AboutUs.js

import React from 'react';

const AboutUs = () => {
    return (
        <section className="p-8">
            <h2 className="text-3xl font-bold text-center">About TUAA</h2>
            <div className="mt-4 text-lg text-gray-600">
                <p>
                    The Tezpur University Alumni Association (TUAA) was formed in September 2000, 
                    aiming to provide a platform for the alumni of Tezpur University to contribute 
                    actively to the comprehensive progress and development of the University. The 
                    inception of TUAA was significantly influenced by the initiatives and keen interest 
                    of Prof. P. Bhattacharyya, the then Vice-Chancellor of Tezpur University, and Prof. 
                    P. K. Brahma of the Department of Electronics. Prof. Brahma notably served as the 
                    first working President of TUAA.
                </p>
                <p className="mt-4">
                    Currently, the mantle of the Working President of TUAA is held by Prof. D. Deka, 
                    from the Department of Energy, Tezpur University. TUAA continues to stride forward 
                    with the goal of amalgamating experience with education. It fosters a robust 
                    connection between Tezpur University and its alumni, underscoring the enduring 
                    bond and shared commitment to the university's legacy and ongoing journey.
                </p>
            </div>
        </section>
    );
};

export default AboutUs;
