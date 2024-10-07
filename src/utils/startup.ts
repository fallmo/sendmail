import dotenv from "dotenv";

export function validateEnvironmentVariables() {
  const { error } = dotenv.config();
  const requiredVars = [
    "SMTP_HOST",
    "SMTP_USERNAME",
    "SMTP_PORT",
    "SMTP_TLS",
    "RABBITMQ_HOST",
  ];
  const optionalVars = [
    "SMTP_PASSWORD",
    "SMTP_SERVICE_CLIENT",
    "SMTP_PRIVATE_KEY",
  ];

  for (const key of requiredVars) {
    const val = process.env[key]?.trim();
    if (val) continue;
    console.error(`ERROR: Missing Environment Variable '${key}'`);
    process.exit(1);
  }

  for (const key of optionalVars) {
    const val = process.env[key]?.trim();
    if (val) continue;
    console.warn(`WARNING: Missing Environment Variable '${key}'`);
  }
}
