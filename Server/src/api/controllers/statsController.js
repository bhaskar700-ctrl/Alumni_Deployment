// controllers/statsController.js
import User from "../models/User.js";
import Event from "../models/Event.js";
import Job from "../models/Job.js";
import Donation from "../models/Donation.js";

export const getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user count" });
  }
};

export const getEventsCount = async (req, res) => {
  try {
    const count = await Event.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching event count" });
  }
};

export const getDonationsCount = async (req, res) => {
  try {
    const count = await Donation.countDocuments({ status: 'completed' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching donation count" });
  }
};

export const getJobsCount = async (req, res) => {
  try {
    const count = await Job.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching job postings count" });
  }
};
