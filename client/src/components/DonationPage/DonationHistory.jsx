import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDonationHistory, resetDonationState } from '../../redux/store/donationSlice';

const DonationHistory = () => {
    const dispatch = useDispatch();
    const { history, status, error } = useSelector(state => state.donations);

    useEffect(() => {
        console.log('Dispatching fetchDonationHistory...');
        dispatch(fetchDonationHistory());

        // Clean up state on component unmount
        return () => {
            console.log('Component unmounting, resetting donation state...');
            dispatch(resetDonationState());
        };
    }, [dispatch]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    return (
        <div className="flex justify-center">
            <div className="w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">Donation History</h1>
                <table className="w-full bg-white shadow-md rounded-md overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4">Amount</th>
                            <th className="py-2 px-4">Message</th>
                            <th className="py-2 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length ? (
                            history.map((donation) => (
                                <tr key={donation._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center">{donation.amount} INR</td>
                                    <td className="py-2 px-4 text-center">{donation.message || 'No message'}</td>
                                    <td className="py-2 px-4 text-center">{donation.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="py-4 text-center" colSpan="3">No donations found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DonationHistory;
