import Job from '../models/Job.js';
import User from '../models/User.js';
import NotificationController from './notificationController.js';

const jobController = {
    createJob: async (req, res) => {
        try {
            const { title, description, location, company, type, applyLink, author, lastDateToApply, imageUrl } = req.body;

            let image = imageUrl;
            if (req.file) {
                image = `/uploads/images/${req.file.filename}`;
            }

            const newJob = new Job({ title, description, location, company, type, applyLink, author, lastDateToApply, image });
            await newJob.save();

            const users = await User.find({});
            users.forEach(user => {
                NotificationController.createNotification(
                    user._id,
                    'New Job Posting',
                    `New job available: ${title} at ${company}`,
                    `/jobs/${newJob._id}`
                );
            });

            res.status(201).json(newJob);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllJobs: async (req, res) => {
        try {
            const jobs = await Job.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
            res.status(200).json(jobs);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    

    getJobById: async (req, res) => {
        try {
            const job = await Job.findById(req.params.jobId);
            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }
            res.status(200).json(job);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateJob: async (req, res) => {
        try {
            const { imageUrl } = req.body;
            const updatedJobData = { ...req.body };

            if (req.file) {
                updatedJobData.image = `/uploads/images/${req.file.filename}`;
            } else if (imageUrl) {
                updatedJobData.image = imageUrl;
            }

            const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, updatedJobData, { new: true });
            if (!updatedJob) {
                return res.status(404).json({ message: 'Job not found' });
            }

            const users = await User.find({});
            users.forEach(user => {
                NotificationController.createNotification(
                    user._id,
                    'Job Update',
                    `Job updated: ${updatedJob.title} at ${updatedJob.company}`,
                    `/jobs/${updatedJob._id}`
                );
            });

            res.status(200).json(updatedJob);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteJob: async (req, res) => {
        try {
            const job = await Job.findById(req.params.jobId);
            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            const isAuthor = job.author.equals(req.user._id);
            const isAdmin = req.user.userType === 'admin';

            if (!isAuthor && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to delete this job' });
            }

            const jobTitle = job.title;
            const jobCompany = job.company;

            await Job.findByIdAndDelete(req.params.jobId);

            const interestedUsers = await User.find({});
            interestedUsers.forEach(user => {
                NotificationController.createNotification(
                    user._id,
                    'Job Deleted',
                    `Job removed: ${jobTitle} at ${jobCompany}`,
                    `/jobs`
                );
            });

            res.status(200).json({ message: 'Job deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default jobController;
