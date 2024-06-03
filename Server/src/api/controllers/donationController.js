import Razorpay from 'razorpay';
import Donation from '../models/Donation.js';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

const donationController = {
  makeDonation: async (req, res) => {
    const { amount, message } = req.body;
    const donorId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount." });
    }

    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${donorId}`,
      payment_capture: '1'
    };

    try {
      const order = await razorpay.orders.create(options);
      const newDonation = new Donation({
        donor: donorId,
        amount,  // Storing in INR
        message,
        orderId: order.id,
        status: 'pending'
      });

      await newDonation.save();

      res.status(201).json({
        message: "Donation order created successfully.",
        orderId: order.id,
        amount: amountInPaise,
        currency: "INR"
      });
    } catch (error) {
      console.error("Error in creating donation order:", error);
      res.status(500).json({ message: "Unable to create donation order." });
    }
  },

  getDonations: async (req, res) => {
    try {
      const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(donations);
    } catch (error) {
      console.error("Error fetching donation history:", error);
      res.status(500).json({ message: "Error retrieving donation history." });
    }
  },

  updatePaymentStatus: async (req, res) => {
    const { orderId, razorpayPaymentId } = req.body;
    try {
      const donation = await Donation.findOne({ orderId });
      if (!donation) {
        return res.status(404).json({ message: "Donation order not found." });
      }

      donation.razorpayPaymentId = razorpayPaymentId;
      donation.status = 'completed';
      await donation.save();

      res.status(200).json({ message: "Payment status updated successfully." });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Failed to update payment status." });
    }
  },

  refundDonation: async (req, res) => {
    const { donationId } = req.params;
    try {
      const donation = await Donation.findById(donationId);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found." });
      }

      const refund = await razorpay.payments.refund(donation.razorpayPaymentId, {
        amount: Math.round(donation.amount * 100)  // Convert back to paise
      });

      donation.status = 'refunded';
      await donation.save();

      res.status(200).json({
        message: "Donation refunded successfully.",
        refund
      });
    } catch (error) {
      console.error("Refund Error:", error);
      res.status(500).json({ message: "Failed to process refund." });
    }
  },

  handleWebhook: async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature to ensure that the request is from Razorpay
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
      return res.status(400).send("Invalid signature. It is possible that this request is not sent from Razorpay.");
    }

    try {
      switch (req.body.event) {
        case 'payment.captured':
          await Donation.findOneAndUpdate(
            { orderId: req.body.payload.payment.entity.order_id },
            { status: 'completed', razorpayPaymentId: req.body.payload.payment.entity.id }
          );
          break;
        case 'payment.failed':
          await Donation.findOneAndUpdate(
            { orderId: req.body.payload.payment.entity.order_id },
            { status: 'failed' }
          );
          break;
        default:
          console.log(`Unhandled event type ${req.body.event}`);
          break;
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(500).send(`Webhook Handler Error: ${error.message}`);
    }
  }
};

export default donationController;
