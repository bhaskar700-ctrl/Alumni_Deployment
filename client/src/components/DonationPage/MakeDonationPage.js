import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeDonation, updatePaymentStatus } from '../../redux/store/donationSlice';
import { useNavigate } from 'react-router-dom';
import { selectUserType } from '../../redux/store/authSlice'; // Import selectUserType

const MakeDonationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const { status, error } = useSelector(state => state.donations || {});
  const { token } = useSelector(state => state.auth);
  const userType = useSelector(selectUserType); // Use the selector to get the user type

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript().then(loaded => {
      if (!loaded) {
        console.error('Failed to load Razorpay SDK');
      }
    });
  }, []);

  const openRazorpayCheckout = async (data) => {
    const { amount, orderId } = data;

    const options = {
      key: 'rzp_test_4eiyhDHBG1welP',
      amount: amount.toString(),
      currency: "INR",
      name: "Your Organization Name",
      description: "Donation Payment",
      image: "https://yourwebsite.com/logo.png",
      order_id: orderId,
      handler: function (response) {
        dispatch(updatePaymentStatus({
          orderId: orderId,
          razorpayPaymentId: response.razorpay_payment_id,
        }));
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#F37254"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(amount) <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }
    dispatch(makeDonation({ amount, message, token })).then((action) => {
      if (action.type === 'donations/makeDonation/fulfilled') {
        openRazorpayCheckout(action.payload);
        setAmount('');
        setMessage('');
      }
    });
  };

  return (
    <div className='flex items-center justify-center h-screen bg-cover bg-center' style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url("https://d6xcmfyh68wv8.cloudfront.net/blog-content/uploads/2021/01/v03.png")'}}>
      <div className='w-72 h-5/6 border-2 ml-16 bg-slate-50 border-sky-500 rounded-lg max-w-md'>
        <h1 className='text-3xl text-center font-bold mb-4'>Make a Donation</h1>
        <img src='https://i.ibb.co/QDMrqK5/Saly-10.png' alt='Organization Logo' className='w-24 h-24 mx-auto mb-4' />
        {status === 'failed' && <div className='text-red-500'>Error: {error}</div>}
        {status === 'succeeded' && <div className='text-green-500'>Donation successful!</div>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <label htmlFor="amount" className='block font-bold mx-3'>
            Amount (INR):
            <input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className='border-gray-300 border rounded-md mx-3 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </label>
          <label htmlFor="message" className='block font-bold mx-3'>
            Message:
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='border-gray-300 border rounded-md mx-5 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </label>
          <div className='flex items-center justify-center'>
            <button type="submit" className='mx-6 py-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'>Submit</button>
            {(userType === 'alumni' || userType === 'student' || userType === 'faculty') && (
              <button
                onClick={() => navigate('/donation-history')}
                className='mx-6 py-auto bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600'
              >
                Show History
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeDonationPage;
