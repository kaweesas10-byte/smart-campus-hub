const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Event = require('./models/Event');
const Announcement = require('./models/Announcement');
const LostItem = require('./models/LostItem');
const StudyGroup = require('./models/StudyGroup');

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 2. CREATE an Event (POST /api/events)
app.post('/api/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. GET all Events (GET /api/events)
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 4. REGISTER for an Event (POST /api/events/:id/attendees)
app.post('/api/events/:id/attendees', async (req, res) => {
  try {
    const { studentName, studentEmail } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Add attendee to the embedded array
    event.attendees.push({ studentName, studentEmail });
    await event.save();

    res.status(200).json({ message: 'Successfully registered for the event!', event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. DELETE an Event (DELETE /api/events/:id)
app.delete('/api/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// --- ANNOUNCEMENTS ROUTES ---

// GET all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ datePosted: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new announcement
app.post('/api/announcements', async (req, res) => {
  try {
    const newAnnouncement = new Announcement(req.body);
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an announcement
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// --- LOST & FOUND ROUTES ---

// GET all lost & found items
app.get('/api/lost-items', async (req, res) => {
  try {
    const items = await LostItem.find().sort({ dateReported: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new lost or found item
app.post('/api/lost-items', async (req, res) => {
  try {
    const newItem = new LostItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a lost item entry (e.g., when found/resolved)
app.delete('/api/lost-items/:id', async (req, res) => {
  try {
    await LostItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item entry removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// --- STUDY GROUP ROUTES ---

// GET all study groups
app.get('/api/study-groups', async (req, res) => {
  try {
    const groups = await StudyGroup.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new study group
app.post('/api/study-groups', async (req, res) => {
  try {
    const newGroup = new StudyGroup(req.body);
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a study group
app.delete('/api/study-groups/:id', async (req, res) => {
  try {
    await StudyGroup.findByIdAndDelete(req.params.id);
    res.json({ message: 'Study group closed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE / WITHDRAW an attendee from an event
app.delete('/api/events/:eventId/attendees', async (req, res) => {
  try {
    const { regNumber, studentEmail } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Filter out the attendee by Reg Number or Email
    const initialCount = event.attendees.length;
    event.attendees = event.attendees.filter(att => 
      att.regNumber !== regNumber && att.studentEmail !== studentEmail
    );

    if (event.attendees.length === initialCount) {
      return res.status(404).json({ message: 'Matching attendee registration not found.' });
    }

    await event.save();
    res.json({ message: 'Successfully withdrawn from event registration.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST / LEAVE a study group
app.post('/api/study-groups/:id/leave', async (req, res) => {
  try {
    const { regNumber } = req.body;
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Study group not found' });

    // Optional: If tracking members array inside StudyGroup schema
    if (group.members && group.members.length > 0) {
      const initialCount = group.members.length;
      group.members = group.members.filter(m => m.regNumber !== regNumber);
      
      if (group.members.length === initialCount) {
        return res.status(404).json({ message: 'Registration number not found in this group.' });
      }
      await group.save();
    }

    res.json({ message: 'Successfully left the study group!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});