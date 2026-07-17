import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: String, // References User._id (Firebase UID)
    ref: 'User',
    required: true,
  },
  resumeName: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  analysisResult: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Analysis', AnalysisSchema);
