import React from "react";
import UserProfileSummary from "./UserProfileSummary/UserProfileSummary";
import DashBoardEvents from "./DashboardEvents/DashBoardEvents";
import JobBoard from "./JobBoard/JobBoard";
import RecentNews from "./RecentNews/RecentNews";
import DashboardStatistics from "./DasboardStatistics/DashboardStatistics"; // Corrected path
// import DonationStatistics from "./DonationStatistics/DonationStatistics";
import Highlights from "./Highlights/Highlights";

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row border rounded-lg bg-slate-400 w-full">
        <div className="m-6 w-full md:w-2/3">
          <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            <UserProfileSummary />
          </div>
        </div>
        <div className="m-6 w-full md:w-1/3">
          <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            <RecentNews />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DashboardStatistics />
      </div>

      <div className="mt-4">
        <Highlights />
      </div>

      <div className="flex flex-col lg:flex-row w-full h-full mt-10 text-gray-500">
        <div className="flex flex-col lg:flex-row justify-around w-full h-full border-2 bg-indigo-600 rounded-lg p-4 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg w-full">
            <DashBoardEvents />
          </div>
          <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg w-full">
            <JobBoard />
          </div>
        </div>
      </div>

      {/* Uncomment if needed
      <div className="mt-4 w-full lg:w-1/3 rounded-lg border-2">
        <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <DonationStatistics />
        </div>
      </div> 
      */}
    </div>
  );
};

export default DashboardPage;
