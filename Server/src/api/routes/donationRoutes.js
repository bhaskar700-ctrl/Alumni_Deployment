import express from 'express';
import donationController from '../controllers/donationController.js';
import authenticate from '../../middleware/authenticate.js';

const router = express.Router();

router.post('/make', authenticate, donationController.makeDonation);
router.get('/history', authenticate, donationController.getDonations);
router.post('/refund/:donationId', authenticate, donationController.refundDonation);
router.post('/update-payment-status', authenticate, donationController.updatePaymentStatus);

// Razorpay webhook endpoint
router.post('/webhooks/razorpay', express.json(), donationController.handleWebhook);

export default router;
