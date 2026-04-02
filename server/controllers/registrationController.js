const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { sendMessage } = require("../config/rabbitmq");

exports.registerEvent = async (req, res) => {
  try {
    const { studentId, eventId } = req.body;

    // 🔥 1. FETCH EVENT FIRST (to get capacity)
    const eventData = await Event.findById(eventId);

    if (!eventData) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔥 2. ATOMIC UPDATE USING DYNAMIC CAPACITY
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        registeredCount: { $lt: eventData.capacity },
      },
      {
        $inc: { registeredCount: 1 },
      },
      { returnDocument: "after" }
    );

    if (!event) {
      return res.status(400).json({ message: "Event is full" });
    }

    // 🔥 3. CREATE REGISTRATION (UNIQUE SAFE)
    const registration = await Registration.create({ studentId, eventId });

    // 🔥 4. SEND TO RABBITMQ
    sendMessage(
      JSON.stringify({
        type: "NEW_REGISTRATION",
        studentId,
        eventId,
      })
    );

    res.json(registration);

  } catch (err) {
    // 🔥 HANDLE DUPLICATE ERROR
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already registered" });
    }

    res.status(500).json({ error: err.message });
  }
};