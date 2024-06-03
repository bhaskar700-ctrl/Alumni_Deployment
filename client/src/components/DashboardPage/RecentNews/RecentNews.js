import React from 'react';

const RecentNews = () => {
  return (
    <div className="flex items-center border-2 rounded-lg justify-center">
      <div className="md:w-96 p-5 text-gray-500 bg-white">
        <h1 className="pt-2 pb-7 text-gray-800 font-bold text-lg">
          Recent Updates
        </h1>
        <div className="h-40 overflow-hidden relative"> {/* Adjust height as needed */}
          <div className="absolute w-full animate-scroll">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-200">
                  <img
                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/card3-svg1.svg"
                    alt="cart"
                  />
                </div>
                <a
                  href="#"
                  className="focus:outline-none focus:underline focus:text-gray-400 text-gray-600 hover:text-gray-500"
                >
                  <p className="text-sm font-medium pl-3">Btech admisssion Notification</p>
                </a>
              </div>
            
            </div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-green-200">
                  <img
                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/card3-svg2.svg"
                    alt="message"
                  />
                </div>
                <a
                  href="#"
                  className="focus:outline-none focus:underline focus:text-gray-400 text-gray-600 hover:text-gray-500"
                >
                  <p className="text-sm font-medium pl-3">
                    Phd and Mtech admission
                  </p>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-200">
                  <img
                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/card3-svg1.svg"
                    alt="cart"
                  />
                </div>
                <a
                  href="#"
                  className="focus:outline-none focus:underline focus:text-gray-400 text-gray-600  hover:text-gray-500"
                >
                  <p className="text-sm font-medium pl-3">Placement Notification</p>
                </a>
              </div>
            
            </div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-green-200">
                  <img
                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/card3-svg3.svg"
                    alt="text"
                  />
                </div>
                <a
                  href="#"
                  className="focus:outline-none focus:underline focus:text-gray-400 text-gray-600  hover:text-gray-500"
                >
                  <p className="text-sm font-medium pl-3">ALUMNI MEETUP</p>
                </a>
              </div>
              <a
                href="#"
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-800 rounded-md focus:text-indigo-800 hover:text-indigo-800 text-indigo-700"
              >
        
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentNews;
