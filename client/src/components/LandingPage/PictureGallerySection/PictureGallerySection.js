import React from 'react';

const PictureGallerySection = () => {
    const images = [
        'https://www.tezu.ernet.in/images/jan233.jpg',
        'https://adaptnet.aua.gr/images/Images/TEZU/TU_Photo.jpg',
        'https://www.indiablooms.com/news_pic/2022/fa3e2e7d6ff6ee2e7450cbe9fcc4b874.jpg',
        // Add more image paths here

    ];
    

    return (
        <section className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg">
                    <img
                        src={image}
                        alt={`Gallery ${index}`}
                        className="w-full h-auto object-cover"
                        style={{ width: '500px', height: '500px' }} // Adjust the width and height as needed
                    />
                </div>
            ))}
        </div>
    </section>
    );
};

export default PictureGallerySection;
