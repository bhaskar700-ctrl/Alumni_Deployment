import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopDonors } from '../../redux/store/donationAnalyticsSlice';

const TopDonorsList = () => {
  const dispatch = useDispatch();
  const { topDonors, status, error } = useSelector((state) => state.donationAnalytics);

  useEffect(() => {
    dispatch(fetchTopDonors());
  }, [dispatch]);

  useEffect(() => {
    console.log('Top Donors State:', topDonors); // Add this line
  }, [topDonors]);

  return (
    <div className="bg-white col-span-4 flex flex-col items-center rounded-lg shadow-lg p-4" style={{ gridRow: 'span 32' }}>
      <div className="sticky top-0 bg-white w-full text-center">
        <h2 className="text-black text-2xl font-semibold mb-4">Top Donors</h2>
      </div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p className="text-red-500">Error: {error}</p>}
      {status === 'succeeded' && topDonors && topDonors.length > 0 && (
        <ul className="text-black text-lg list-none w-full space-y-2 text-center">
          {topDonors.map((donor, index) => (
            <li key={index} className="mb-2">
              <div className="font-semibold">{index + 1}. {donor.name}</div>
              <div className="text-gray-500">₹{donor.totalAmount}</div>
            </li>
          ))}
        </ul>
      )}
      {status === 'succeeded' && (!topDonors || topDonors.length === 0) && (
        <p>No donors found.</p>
      )}
    </div>
  );
};

export default TopDonorsList;
