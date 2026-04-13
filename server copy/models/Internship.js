const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    certificate: {
      type: String,
      default: null,
    },
    lor: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    evaluation: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      remarks: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

// Virtual for duration in days
internshipSchema.virtual('durationDays').get(function () {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

internshipSchema.set('toJSON', { virtuals: true });
internshipSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Internship', internshipSchema);
