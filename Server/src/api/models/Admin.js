import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const adminSchema = new Schema({
  adminId: {
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

const Admin = model('Admin', adminSchema);
export default Admin;
