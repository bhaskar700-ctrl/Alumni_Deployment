import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    trim: true
  },
  orderId: {  // This replaces paymentIntentId and stores the Razorpay order ID
    type: String,
    required: true
  },
  razorpayPaymentId: {  // Store the Razorpay payment ID after the payment is successful
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],  // Added 'refunded' to the status options
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
