const amqp = require("amqplib");

async function consumeMessages() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("eventQueue");

  channel.consume("eventQueue", (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();

      try {
        // 🔥 Try parsing JSON
        const data = JSON.parse(content);
        console.log("Received message:", data);
      } catch (err) {
        // 🔥 Handle non-JSON safely
        console.log("Received non-JSON message:", content);
      }

      channel.ack(msg);
    }
  });
}

module.exports = consumeMessages;