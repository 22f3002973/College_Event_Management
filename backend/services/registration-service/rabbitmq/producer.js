const amqp = require("amqplib");

async function sendMessage(queue, message) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    console.log("📤 Sent to queue:", message);

    setTimeout(() => connection.close(), 500);
  } catch (err) {
    console.error("RabbitMQ Producer Error:", err);
  }
}

module.exports = sendMessage;