const amqp = require("amqplib");
const Event = require("../models/Event");

async function consumeMessages() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "event_queue";

    await channel.assertQueue(queue);

    console.log("📥 Waiting for messages...");

    channel.consume(queue, async (msg) => {
      const data = JSON.parse(msg.content.toString());

      console.log("📩 Received:", data);

      // 🔥 Reduce capacity safely
      await Event.findOneAndUpdate(
        { _id: data.eventId, capacity: { $gt: 0 } },
        { $inc: { capacity: -1 } }
      );
      await Event.findByIdAndUpdate(
  data.eventId,
  { $addToSet: { registeredUsers: data.userId } }
);

      channel.ack(msg);
    });

  } catch (err) {
    console.error("RabbitMQ Consumer Error:", err);
  }
}

module.exports = consumeMessages;