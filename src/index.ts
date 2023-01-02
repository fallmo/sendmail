"use strict";

import { listenHttp } from "./utils/http";
import { createMailerTransport } from "./utils/mail";
import { validateEnvironmentVariables } from "./utils/startup";

async function run() {
  validateEnvironmentVariables();
  createMailerTransport();

  listenHttp();
}

run();
