const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'Academic', 'Exam', 'Urgent'], default: 'General' },
  author: { type: String, required: true },
  datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);