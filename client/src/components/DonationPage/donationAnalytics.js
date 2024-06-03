import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChartsSection from './ChartsSection';
import TopDonorsList from './TopDonorsList';
import {
  fetchTotalDonations,
  fetchTotalRepeatedDonors,
  fetchTotalUniqueDonors,
  fetchOverallTotalDonations,
  fetchDonationFrequency,
  fetchAverageDonationAmount,
  fetchTopDonors,
  fetchTotalCompletedDonations // Import the new thunk
} from '../../redux/store/donationAnalyticsSlice';

const DonationAnalyticsComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: {
      donationsByFilter,
      totalRepeatedDonors,
      totalUniqueDonors,
      overallTotalDonations,
      donationFrequency,
      averageDonationAmount,
      topDonors,
      totalCompletedDonations, // Get the total completed donations from state
    },
    status,
    error,
  } = useSelector((state) => state.donationAnalytics);

  const [isBarChartOpen, setIsBarChartOpen] = useState(false);
  const [isLineChartOpen, setIsLineChartOpen] = useState(false);
  const [filter, setFilter] = useState('month');

  useEffect(() => {
    dispatch(fetchTotalDonations(filter));
    dispatch(fetchTotalRepeatedDonors());
    dispatch(fetchTotalUniqueDonors());
    dispatch(fetchOverallTotalDonations());
    dispatch(fetchDonationFrequency());
    dispatch(fetchAverageDonationAmount());
    dispatch(fetchTopDonors());
    dispatch(fetchTotalCompletedDonations()); // Dispatch the new thunk
  }, [dispatch, filter]);

  console.log('donationsByFilter:', donationsByFilter); // Log the fetched data

  const barChartData = donationsByFilter;
  const lineChartData = donationsByFilter;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* First row - 4 items spanning 3 columns each */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 col-span-12 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg h-full">
          <div className="grid grid-cols-6 gap-4 w-full h-full">
            <div className="col-span-4 bg-white flex items-center justify-center rounded-lg shadow-lg h-full">
              <h2 className="text-black text-2xl font-semibold">DONATION ANALYTICS</h2>
            </div>
            <div className="col-span-1 bg-white flex items-center justify-center rounded-lg shadow-lg h-full">
              <button
                onClick={() => navigate('/donation-history')}
                className="text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
              >
                Show History
              </button>
            </div>
            

            <div className="col-span-1 bg-blue-600 lg:bg-white flex items-center justify-center rounded-lg shadow-lg h-full">
              <button
                onClick={() => navigate('/make-donation')}
                className="text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
              >
                Donate
              </button>
            </div>
          </div>
        </div>

        <ChartsSection
          isBarChartOpen={isBarChartOpen}
          setIsBarChartOpen={setIsBarChartOpen}
          isLineChartOpen={isLineChartOpen}
          setIsLineChartOpen={setIsLineChartOpen}
          filter={filter}
          setFilter={setFilter}
          barChartData={barChartData}
          lineChartData={lineChartData}
        />

        <TopDonorsList topDonors={topDonors} />

        {/* Default grid items - 1 column each */}
        <button className="bg-gradient-to-r from-green-400 to-teal-500 col-span-2 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg cursor-pointer">
          <h2 className="text-white text-xl font-semibold">Month</h2>
        </button>
        <button className="bg-gradient-to-r from-green-400 to-teal-500 col-span-2 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg cursor-pointer">
          <h2 className="text-white text-xl font-semibold">Year</h2>
        </button>

        {/* Statistics grid items */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 col-span-4 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-white text-xl font-semibold">Total Repeated Donors</h2>
            <p className="text-white text-2xl">{totalRepeatedDonors?.repeatedDonors || 0}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-red-500 col-span-4 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-white text-xl font-semibold">Total Unique Donors</h2>
            <p className="text-white text-2xl">{totalUniqueDonors?.totalDonors || 0}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-red-500 col-span-4 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-white text-xl font-semibold">Overall Total Donations</h2>
            <p className="text-white text-2xl">₹{overallTotalDonations?.totalAmount || 0}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-red-500 col-span-4 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-white text-xl font-semibold">Total Donations</h2>
            <p className="text-white text-2xl">{totalCompletedDonations || 0}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-red-500 col-span-4 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-white text-xl font-semibold">Donation Frequency</h2>
            <p className="text-white text-2xl">{donationFrequency?.averageFrequency || 0}%</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-red-500 col-span-4 row-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-white text-xl font-semibold">Average Donation Amount</h2>
            <p className="text-white text-2xl">₹{averageDonationAmount?.averageAmount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationAnalyticsComponent;
