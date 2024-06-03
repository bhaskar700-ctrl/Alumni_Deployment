import express from 'express';
import {
  getTotalDonations,
  getTotalRepeatedDonors,
  getTotalUniqueDonors,
  getOverallTotalDonations,
  getDonationFrequency,
  getAverageDonationAmount,
  getTopDonors,
  getDonationsByFilter,
  getDonationsByYears,
  getTotalCompletedDonations
} from '../controllers/donationAnalyticsController.js';

const router = express.Router();

router.get('/total-donations', getTotalDonations);
router.get('/total-repeated-donors', getTotalRepeatedDonors);
router.get('/total-unique-donors', getTotalUniqueDonors);
router.get('/overall-total-donations', getOverallTotalDonations);
router.get('/donation-frequency', getDonationFrequency);
router.get('/average-donation-amount', getAverageDonationAmount);
router.get('/top-donors', getTopDonors);
router.get('/donations-by-filter', getDonationsByFilter); // New route for bar chart data
router.get('/donations-by-years', getDonationsByYears); // New route for line chart data
router.get('/total-completed-donations', getTotalCompletedDonations); 

export default router;
