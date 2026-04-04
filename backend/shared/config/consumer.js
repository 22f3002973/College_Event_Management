const amqp = require("amqplib");

async function consumeMessages() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("eventQueue");

  channel.consume("eventQueue", (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log("📊 Analytics received:", data);

    channel.ack(msg);
  });
}

module.exports = consumeMessages;