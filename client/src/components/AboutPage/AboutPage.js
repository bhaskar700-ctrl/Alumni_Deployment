import React from 'react';

const AboutUs = () => {
    return (
        <div className="2xl:container rounded-lg shadow-md border-2 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800  pb-4">About the Project</h1>
                    <p className="font-normal text-base leading-6 text-justify text-gray-600">
                    The Alumni Information System for Tezpur University is a comprehensive web-based platform designed to foster seamless communication, efficient information management, and meaningful connections among alumni, administrators, and supervisors. Utilizing the MERN (MongoDB, Express.js, React, Node.js) stack, the system provides a user-friendly interface that allows alumni to create and manage profiles, participate in events, and stay connected with their alma mater.
                    </p>
                </div>
                <div className="w-full lg:w-8/12">
                    <img className="w-full h-full" src="https://www.univariety.com/blog/wp-content/uploads/2022/02/5853-min-scaled.jpg" alt="A group of People" />
                </div>
            </div>
    
            <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800  pb-4">About us</h1>
                    <p className="font-normal text-base leading-6 text-justify text-gray-600 ">
                        We are group of three people of 8th semester of Btech CSE, We have done this project as a final Year project. In this project we have gain hands-on knowledge on Web-development using Mern Stack.
                    </p>
                </div>
                <div className="w-full lg:w-8/12 lg:pt-8">
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
                        <div className="p-4 pb-6 flex justify-center flex-col items-center">
                            <img className="md:block hidden" src="https://i.ibb.co/FYTKDG6/Rectangle-118-2.png" alt="Alexa featured Image" />
                            <img className="md:hidden block" src="https://i.ibb.co/zHjXqg4/Rectangle-118.png" alt="Alexa featured Image" />
                            <p className="font-medium text-xl leading-5 text-gray-800  mt-4">Bhaskar Pathak</p>
                        </div>
                        <div className="p-4 pb-6 flex justify-center flex-col items-center">
                            <img className="md:block hidden" src="https://i.ibb.co/fGmxhVy/Rectangle-119.png" alt="Olivia featured Image" />
                            <img className="md:hidden block" src="https://i.ibb.co/NrWKJ1M/Rectangle-119.png" alt="Olivia featured Image" />
                            <p className="font-medium text-xl leading-5 text-gray-800  mt-4">Anit Mili</p>
                        </div>
                        <div className="p-4 pb-6 flex justify-center flex-col items-center">
                            <img className="md:block hidden" src="https://i.ibb.co/Pc6XVVC/Rectangle-120.png" alt="Liam featued Image" />
                            <img className="md:hidden block" src="https://i.ibb.co/C5MMBcs/Rectangle-120.png" alt="Liam featued Image" />
                            <p className="font-medium text-xl leading-5 text-gray-800  mt-4">Bhaskar Sonowal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
