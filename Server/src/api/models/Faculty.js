import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const facultySchema = new Schema({
  facultyId: {
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
  title: {
    type: String,
    required: true
  },
  phoneNumber: String,
  dateOfBirth: {
    type: Date,
    required: true
  },
  isRegistered: {
    type: Boolean,
    default: false
  }
});

const Faculty = model('Faculty', facultySchema);
export default Faculty;
