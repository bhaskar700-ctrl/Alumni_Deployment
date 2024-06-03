import Donation from '../models/Donation.js';
import User from '../models/User.js';

// Controller methods...
export const getDonationsByFilter = async (req, res) => {
  const { filter } = req.query;

  let groupBy = {};
  let projectBy = {};

  switch (filter) {
    case 'day':
      groupBy = {
        _id: { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        totalAmount: { $sum: '$amount' }
      };
      projectBy = {
        _id: 0,
        date: { $dateToString: { format: "%Y-%m-%d", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: "$_id.day" } } } },
        totalAmount: 1
      };
      break;
    case 'month':
      groupBy = {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        totalAmount: { $sum: '$amount' }
      };
      projectBy = {
        _id: 0,
        date: { $dateToString: { format: "%Y-%m", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } } } },
        totalAmount: 1
      };
      break;
    case 'year':
      groupBy = {
        _id: { year: { $year: '$createdAt' } },
        totalAmount: { $sum: '$amount' }
      };
      projectBy = {
        _id: 0,
        date: { $dateToString: { format: "%Y", date: { $dateFromParts: { year: "$_id.year", month: 1, day: 1 } } } },
        totalAmount: 1
      };
      break;
    default:
      return res.status(400).json({ message: 'Invalid filter' });
  }

  try {
    const donations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: groupBy },
      { $project: projectBy },
      { $sort: { date: 1 } }
    ]);

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDonationsByYears = async (req, res) => {
  const { year1, year2 } = req.query;

  if (!year1 || !year2) {
    return res.status(400).json({ message: 'Both year1 and year2 must be provided' });
  }

  try {
    const donationsYear1 = await Donation.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: new Date(`${year1}-01-01`), $lt: new Date(`${year1}-12-31`) } } },
      { $group: { _id: { month: { $month: '$createdAt' } }, totalAmount: { $sum: '$amount' } } },
      { $sort: { '_id.month': 1 } }
    ]);

    const donationsYear2 = await Donation.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: new Date(`${year2}-01-01`), $lt: new Date(`${year2}-12-31`) } } },
      { $group: { _id: { month: { $month: '$createdAt' } }, totalAmount: { $sum: '$amount' } } },
      { $sort: { '_id.month': 1 } }
    ]);

    res.status(200).json({ year1: donationsYear1, year2: donationsYear2 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTotalDonations = async (req, res) => {
  const { filter } = req.query;
  let groupBy = {};

  if (filter === 'month') {
    groupBy = {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        totalAmount: { $sum: '$amount' },
      },
    };
  } else if (filter === 'year') {
    groupBy = {
      $group: {
        _id: { $year: '$createdAt' },
        totalAmount: { $sum: '$amount' },
      },
    };
  } else {
    return res.status(400).json({ message: 'Invalid filter' });
  }

  try {
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      groupBy,
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(totalDonations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTotalRepeatedDonors = async (req, res) => {
  try {
    const repeatedDonors = await Donation.aggregate([
      {
        $group: {
          _id: '$donor',
          count: { $sum: 1 },
        },
      },
      {
        $match: { count: { $gt: 1 } },
      },
      {
        $count: 'repeatedDonors',
      },
    ]);
    res.status(200).json(repeatedDonors[0] || { repeatedDonors: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTotalUniqueDonors = async (req, res) => {
  try {
    const totalDonors = await Donation.distinct('donor');
    res.status(200).json({ totalDonors: totalDonors.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOverallTotalDonations = async (req, res) => {
  try {
    const overallTotal = await Donation.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);
    res.status(200).json(overallTotal[0] || { totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDonationFrequency = async (req, res) => {
  try {
    const frequency = await Donation.aggregate([
      {
        $group: {
          _id: '$donor',
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          averageFrequency: { $avg: '$count' },
        },
      },
    ]);
    res.status(200).json(frequency[0] || { averageFrequency: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAverageDonationAmount = async (req, res) => {
  try {
    const averageAmount = await Donation.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: null,
          averageAmount: { $avg: '$amount' },
        },
      },
    ]);
    res.status(200).json(averageAmount[0] || { averageAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTotalCompletedDonations = async (req, res) => {
  try {
    const totalCompletedDonations = await Donation.countDocuments({ status: 'completed' });
    res.status(200).json({ totalCompletedDonations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopDonors = async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: '$donor',
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'users', // Ensure this matches your User collection name
          localField: '_id',
          foreignField: '_id',
          as: 'donorDetails',
        },
      },
      {
        $unwind: '$donorDetails',
      },
      {
        $project: {
          name: {
            $concat: ['$donorDetails.personalDetails.firstName', ' ', '$donorDetails.personalDetails.lastName']
          },
          totalAmount: 1,
        },
      },
    ]);

    console.log('Top Donors from DB:', topDonors); // Debugging log
    res.status(200).json(topDonors);
  } catch (error) {
    console.error('Error fetching top donors:', error); // Debugging log
    res.status(500).json({ message: error.message });
  }
};