import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'screening', 'interview', 'accepted', 'rejected'],
    default: 'pending',
  },
  currentRound: {
    type: Number,
    default: 1,
  },
  timeline: [{
    round: Number,
    status: {
      type: String,
      enum: ['pending', 'screening', 'interview', 'accepted', 'rejected']
    },
    feedback: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resume: {
    filename: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    data: {
      type: String, // This will store the base64 encoded file
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure a student can only apply once to an internship
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application; 