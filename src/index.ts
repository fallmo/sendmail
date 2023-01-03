"use strict";

import { listenHttp } from "./utils/http";
import { createMailerTransport } from "./utils/mail";
import { listenRabbitMQ } from "./utils/rabbitmq";
import { validateEnvironmentVariables } from "./utils/startup";

async function run() {
  validateEnvironmentVariables();
  createMailerTransport();

  listenHttp();
  listenRabbitMQ();
}

run();
