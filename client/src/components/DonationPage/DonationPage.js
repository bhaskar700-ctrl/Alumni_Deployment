import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDonationHistory, resetDonationState } from '../../redux/store/donationSlice';
import { Link } from 'react-router-dom';

const DonationPage = () => {
    const dispatch = useDispatch();
    const { history, status, error } = useSelector(state => state.donations);

    useEffect(() => {
        dispatch(fetchDonationHistory());

        // Clean up state on component unmount
        return () => {
            dispatch(resetDonationState());
        };
    }, [dispatch]);

    if (status === 'loading') return <div className="text-center mt-4">Loading...</div>;
    if (status === 'failed') return <div className="text-center text-red-500 mt-4">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Donation History</h1>
            <div className="flex justify-center space-x-4 mb-8">
                <Link to="/make-donation">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Make a New Donation
                    </button>
                </Link>
                <Link to="/donation-analytics">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                        View Donation Analytics
                    </button>
                </Link>
            </div>
            {history.length ? (
                <ul className="space-y-4">
                    {history.map((donation) => (
                        <li key={donation._id} className="bg-gray-100 p-4 rounded shadow">
                            <p><strong>Amount:</strong> {donation.amount} INR</p>
                            <p><strong>Message:</strong> {donation.message || 'No message'}</p>
                            <p><strong>Status:</strong> {donation.status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No donations found.</p>
            )}
        </div>
    );
};

export default DonationPage;
