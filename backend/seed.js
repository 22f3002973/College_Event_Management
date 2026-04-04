const mongoose = require("mongoose");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
const Feedback = require("./models/Feedback");

mongoose.connect("mongodb://127.0.0.1:27017/eventify");

async function seed() {
  await Event.deleteMany();
  await Registration.deleteMany();
  await Feedback.deleteMany();

  // ------------------ EVENTS (15) ------------------
  const events = await Event.insertMany([
    { title: "Tech Fest", status: "approved" },
    { title: "Cultural Night", status: "approved" },
    { title: "Hackathon", status: "pending" },
    { title: "Sports Meet", status: "rejected" },
    { title: "AI Workshop", status: "approved" },
    { title: "Music Concert", status: "pending" },
    { title: "Startup Expo", status: "approved" },
    { title: "Drama Fest", status: "rejected" },
    { title: "Gaming Tournament", status: "approved" },
    { title: "Photography Walk", status: "pending" },
    { title: "Robotics Workshop", status: "approved" },
    { title: "Dance Battle", status: "rejected" },
    { title: "Coding Contest", status: "approved" },
    { title: "Entrepreneur Talk", status: "pending" },
    { title: "Art Exhibition", status: "approved" },
  ]);

  // ------------------ REGISTRATIONS (20) ------------------
  await Registration.insertMany([
    { studentId: "S1", eventId: events[0]._id },
    { studentId: "S2", eventId: events[1]._id },
    { studentId: "S3", eventId: events[2]._id },
    { studentId: "S4", eventId: events[3]._id },
    { studentId: "S5", eventId: events[4]._id },
    { studentId: "S6", eventId: events[5]._id },
    { studentId: "S7", eventId: events[6]._id },
    { studentId: "S8", eventId: events[7]._id },
    { studentId: "S9", eventId: events[8]._id },
    { studentId: "S10", eventId: events[9]._id },
    { studentId: "S11", eventId: events[10]._id },
    { studentId: "S12", eventId: events[11]._id },
    { studentId: "S13", eventId: events[12]._id },
    { studentId: "S14", eventId: events[13]._id },
    { studentId: "S15", eventId: events[14]._id },
    { studentId: "S16", eventId: events[0]._id },
    { studentId: "S17", eventId: events[1]._id },
    { studentId: "S18", eventId: events[2]._id },
    { studentId: "S19", eventId: events[3]._id },
    { studentId: "S20", eventId: events[4]._id },
  ]);

  // ------------------ FEEDBACK (20) ------------------
  await Feedback.insertMany([
    { studentId: "S1", eventId: events[0]._id, rating: 5 },
    { studentId: "S2", eventId: events[1]._id, rating: 4 },
    { studentId: "S3", eventId: events[2]._id, rating: 3 },
    { studentId: "S4", eventId: events[3]._id, rating: 2 },
    { studentId: "S5", eventId: events[4]._id, rating: 5 },
    { studentId: "S6", eventId: events[5]._id, rating: 4 },
    { studentId: "S7", eventId: events[6]._id, rating: 5 },
    { studentId: "S8", eventId: events[7]._id, rating: 3 },
    { studentId: "S9", eventId: events[8]._id, rating: 4 },
    { studentId: "S10", eventId: events[9]._id, rating: 2 },
    { studentId: "S11", eventId: events[10]._id, rating: 5 },
    { studentId: "S12", eventId: events[11]._id, rating: 3 },
    { studentId: "S13", eventId: events[12]._id, rating: 4 },
    { studentId: "S14", eventId: events[13]._id, rating: 1 },
    { studentId: "S15", eventId: events[14]._id, rating: 5 },
    { studentId: "S16", eventId: events[0]._id, rating: 4 },
    { studentId: "S17", eventId: events[1]._id, rating: 5 },
    { studentId: "S18", eventId: events[2]._id, rating: 3 },
    { studentId: "S19", eventId: events[3]._id, rating: 2 },
    { studentId: "S20", eventId: events[4]._id, rating: 4 },
  ]);

  console.log("✅ Large dataset inserted (50+ records)");
  process.exit();
}

seed();