import React from 'react';

const ContactUs = () => {
  return (

      <div className="flex flex-row border-2 border-gray-700 rounded-lg w-full">
        <div className="w-3/4 bg-indigo-400 h-full pt-5 pb-5 ">
          <form id="contact" className=" bg-indigo-500 py-4 px-8">
            <h1 className="text-4xl  text-black font-extrabold mb-6">Enter Details</h1>
            <div className="block  w-full  mb-6">
              <div className="w-2/4  mb-6">
                <div className="flex flex-col">
                  <label htmlFor="full_name" className="text-black text-sm font-semibold leading-tight tracking-normal mb-2">
                    Full Name
                  </label>
                  <input
                    required
                    id="full_name"
                    name="full_name"
                    type="text"
                    className="bg-gray-900  dark:border-gray-700 focus:outline-none focus:border focus:border-indigo-700 font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                    placeholder="Full Name"
                    aria-label="enter your full name input"
                  />
                </div>
              </div>
              <div className="w-2/4 ">
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-gray-800  text-sm font-semibold leading-tight tracking-normal mb-2">
                    Email
                  </label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    className="dark:bg-gray-900  dark:border-gray-700 focus:outline-none focus:border focus:border-indigo-700 font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                    placeholder="example@email.com"
                    aria-label="enter your email input"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-wrap">
              <div className="w-2/4 max-w-xs">
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-gray-800 text-sm font-semibold leading-tight tracking-normal mb-2">
                    Phone
                  </label>
                  <input
                    required
                    id="phone"
                    name="phone"
                    type="tel"
                    className="dark:bg-gray-900  dark:border-gray-700 focus:outline-none focus:border focus:border-indigo-700 font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                    placeholder="+92-12-3456789"
                    aria-label="enter your phone number input"
                  />
                </div>
              </div>
            </div>
            <div className="w-full mt-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-800  mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  placeholder=""
                  name="message"
                  className="  dark:border-gray-700 border-gray-300 border mb-4 rounded py-2 text-sm outline-none resize-none px-3 focus:border focus:border-indigo-700"
                  rows="8"
                  id="message"
                  aria-label="enter your message input"
                ></textarea>
              </div>
              <button
                type="submit"
                className="focus:outline-none bg-red-500 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-black-300 px-8 py-3 text-sm leading-6 focus:border-4 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/2  rounded-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.3801182146644!2d92.82818517494013!3d26.700300869187412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3744ebc8fd314411%3A0x28a60e3c5515613b!2sTezpur%20University!5e0!3m2!1sen!2sin!4v1716358778453!5m2!1sen!2sin" 
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
  );
};

export default ContactUs;
