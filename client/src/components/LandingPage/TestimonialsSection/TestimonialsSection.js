import React from 'react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "This platform has been instrumental in reconnecting with my batchmates and expanding my professional network.",
            name: "Jane Doe",
            title: "Software Engineer",
            // image: "/path/to/image.jpg", // Uncomment and replace with path if you have images
        },
        {
            quote: "A fantastic resource for alumni looking to give back to the university community and mentor current students.",
            name: "John Smith",
            title: "Marketing Director",
            // image: "/path/to/image.jpg",
        },
        // Add more testimonials as needed
    ];

    return (
        <section className="bg-gray-100 p-8">
            <h2 className="text-3xl font-bold text-center mb-6">Success Stories</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4">
                        {/* Uncomment if you have images 
                        <img className="w-24 h-24 rounded-full mx-auto" src={testimonial.image} alt={testimonial.name} />
                        */}
                        <div className="text-center mt-4">
                            <p className="text-lg text-gray-600">"{testimonial.quote}"</p>
                            <h3 className="text-xl font-semibold mt-2">{testimonial.name}</h3>
                            <p className="text-md text-gray-500">{testimonial.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;
