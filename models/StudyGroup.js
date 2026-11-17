const mongoose = require('mongoose');

const StudyGroupSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  topic: { type: String, required: true },
  meetingLocation: { type: String, required: true },
  meetingTime: { type: String, required: true },
  maxMembers: { type: Number, default: 5 },
  organizer: { type: String, required: true },
  contactInfo: { type: String, required: true },
  membersCount: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyGroup', StudyGroupSchema);