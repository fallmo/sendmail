import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import { sendMail } from "./mail";
import { parseJSON, validateBody } from "./misc";

let connection: Connection;
let channel: Channel;
const queueName = "mails";

export async function listenRabbitMQ() {
  connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`);
  console.log("Connected to RabbitMQ server..");

  channel = await connection.createChannel();
  channel
    .assertQueue(queueName)
    .catch(reason => {
      console.error(reason);
      console.log("Failed to connect to RabbitMQ");
      process.exit(1);
    })
    .then(reply => {
      const { queue, messageCount, consumerCount } = reply;
      console.log(
        `Rabbit MQ queue ${queue} connected. (messageCount: ${messageCount}; consumerCount: ${consumerCount}) `
      );

      channel.consume(queue, handleMessage, {});
    });
}

function handleMessage(msg: ConsumeMessage | null) {
  if (msg === null) {
    console.log("Consumer cancelled by server");
    return;
  }

  if (msg.properties["contentType"] !== "application/json") {
    console.log(`queue message ignored (ContentType=${msg.properties["contentType"]})`);
    return channel.ack(msg);
  }

  const data = parseJSON(msg.content.toString()); // toJSON?

  const { error, value: fields } = validateBody(data);

  if (error) {
    console.log(`queue message ignored (ValidationError=${error.message})`);
    return channel.ack(msg);
  }

  sendMail({ to: fields.to, subject: fields.subject, text: fields.text, html: fields.html }, 1)
    .catch(err => {
      console.error(err, `Failed to send mail`);
      // infinite loop of failure
      channel.nack(msg, undefined, true);
      return;
    })
    .then(success => {
      if (!success) {
        // infinite loop of failure
        channel.nack(msg, undefined, true);
        return;
      } else return channel.ack(msg);
    });
}
