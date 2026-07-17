import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: {
    type: String, // Stores the Firebase UID
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', UserSchema);
