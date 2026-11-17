const mongoose = require('mongoose');

// Embedded Schema for Event Attendees
const attendeeSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now }
});

// Main Event Schema
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Academic', 'Workshop', 'Sports', 'Cultural', 'Social'],
      default: 'Academic'
    },
    location: { type: String, required: true },
    eventDate: { type: Date, required: true },
    capacity: { type: Number, required: true },
    organizerName: { type: String, required: true },
    attendees: [attendeeSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', eventSchema);