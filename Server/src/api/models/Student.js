import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  department: { type: String, required: true },
  enrollmentYear: { type: Number, required: true },
  graduationYear: Number,
  phoneNumber: String,
  address: String,
  dateOfBirth: { type: Date, required: true },
  nationality: String,
  gender: String,
  program: String,
  status: String, // e.g., "active", "graduated", "withdrawn"
  courses: [{
    courseCode: String,
    courseName: String,
    semester: String,
    grade: String
  }],
  gpa: Number,
  isRegistered: { type: Boolean, default: false },
  signupToken: { type: String, default: null },
  tokenExpiration: { type: Date, default: null }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
