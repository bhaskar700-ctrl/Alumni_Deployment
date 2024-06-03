// src/components/DashboardStatistics.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStats } from "../../../redux/store/statsSlice";
import { fetchOverallTotalDonations } from "../../../redux/store/donationAnalyticsSlice";

const DashboardStatistics = () => {
  const dispatch = useDispatch();
  const { users, events, donations, jobPostings, status, error } = useSelector((state) => state.stats);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStats());
      dispatch(fetchOverallTotalDonations());
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-row justify-around">
      {status === "loading" && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="border-2 rounded-lg h-20 w-1/5 bg-rose-500 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg flex items-center justify-center">
        <h2 className="text-xl text-center text-gray-200 font-bold">
          Registered Users: {users}
        </h2>
      </div>
      <div className="border-2 rounded-lg h-20 w-1/5 flex items-center transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg bg-orange-500 justify-center">
        <h2 className="text-xl text-center text-gray-200 font-bold">Events: {events}</h2>
      </div>
      <div className="border-2 rounded-lg h-20 w-1/5 flex items-center bg-yellow-500 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg justify-center">
        <h2 className="text-xl text-center text-gray-200 font-bold">
          Donations: {donations} {/* Update this line to display overall total donations */}
        </h2>
      </div>
      <div className="border-2 rounded-lg h-20 w-1/5 flex items-center bg-green-500 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg justify-center">
        <h2 className="text-xl text-center text-gray-200 font-bold">
          Job Postings: {jobPostings}
        </h2>
      </div>
    </div>
  );
};

export default DashboardStatistics;
