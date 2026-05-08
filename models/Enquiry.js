const mongoose = require('mongoose');

// ==================== ENQUIRY SCHEMA ====================
const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    
    // Reference to Project (optional - enquiry might be general or specific to a project)
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    },
    
    projectName: {
      type: String,
      trim: true
    },
    
    message: {
      type: String,
      trim: true
    },
    
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Not Interested'],
      default: 'New'
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// ==================== CREATE & EXPORT MODEL ====================
module.exports = mongoose.model('Enquiry', enquirySchema);