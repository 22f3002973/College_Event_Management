const amqp = require("amqplib");

let channel;

async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("eventQueue");
}

function sendMessage(msg) {
  channel.sendToQueue("eventQueue", Buffer.from(JSON.stringify(msg)));
}

module.exports = { connectQueue, sendMessage };