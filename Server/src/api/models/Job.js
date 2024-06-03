// models/Job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: String,
    company: String,
    type: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'] },
    applyLink: String,
    image: String,
    lastDateToApply: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
