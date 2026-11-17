const mongoose = require('mongoose');

// Define the Event schema & model to match your backend
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  capacity: Number,
  location: String,
  eventDate: Date,
  organizerName: String,
  attendees: Array
});

const Event = mongoose.model('Event', eventSchema);

async function updateEventFromTerminal() {
  try {
    // 1. Connect to your local MongoDB database
    await mongoose.connect('mongodb://127.0.0.1:27017/smart_campus_hub');
    console.log("Connected to MongoDB successfully!");

    // 2. Find one event and update its title or capacity
    // This finds the first event in your collection and updates it
    const updatedEvent = await Event.findOneAndUpdate(
      {}, // Empty filter finds the first document it encounters
      { 
        $set: { 
          title: "🚀 Updated via Terminal CLI!", 
          capacity: 100 
        } 
      },
      { new: true } // Returns the updated document instead of the old one
    );

    if (!updatedEvent) {
      console.log("No events found in the database to update. Try creating one first!");
    } else {
      console.log("Successfully updated event in MongoDB!");
      console.log("New Title:", updatedEvent.title);
      console.log("New Capacity:", updatedEvent.capacity);
    }

    // 3. Gracefully close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error updating event:", error);
  }
}

updateEventFromTerminal();