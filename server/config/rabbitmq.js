const amqp = require("amqplib");

let channel;

async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();

  await channel.assertQueue("eventQueue");
  console.log("RabbitMQ Connected");
}

function sendMessage(msg) {
  if (channel) {
    channel.sendToQueue("eventQueue", Buffer.from(msg));
  }
}

module.exports = { connectQueue, sendMessage };