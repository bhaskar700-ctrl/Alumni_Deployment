import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const alumniSchema = new Schema({
  alumniId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: email => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email),
      message: props => `${props.value} is not a valid email address!`
    }
  },
  department: {
    type: String,
    required: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  phoneNumber: String,
  address: String,
  dateOfBirth: {
    type: Date,
    required: true
  },
  nationality: String,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  coursesCompleted: [{
    courseCode: String,
    courseName: String,
    grade: String
  }],
  gpa: {
    type: Number,
    min: 0,
    max: 10
  },
  activities: [String], // Any extracurricular activities or clubs they were part of
  isRegistered: {
    type: Boolean,
    default: false
  }
});

alumniSchema.index({ alumniId: 1, email: 1 }, { unique: true });

const Alumni = model('Alumni', alumniSchema);

export default Alumni;
