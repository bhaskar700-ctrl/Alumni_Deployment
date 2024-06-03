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
    <>
      <div className="">
        <div className="flex border rounded-lg bg-slate-400 w-full">
          <div className="m-6 w-2/3">
            <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <UserProfileSummary />
            </div>
          </div>
          <div className="m-6">
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

        <div className="flex w-full h-full mt-10 text-gray-500">
          <div className="flex flex-row justify-around w-full h-full border-2 bg-indigo-600 rounded-lg">
            <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <DashBoardEvents />
            </div>
            <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <JobBoard />
            </div>
          </div>

          
{/*<div className="ml-4 w-1/3 rounded-lg border-2">
  <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
    <DonationStatistics />
  </div>
</div> 
  */}

        </div>
      </div>
    </>
  );
};

export default DashboardPage;
