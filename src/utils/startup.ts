import dotenv from "dotenv";

export function validateEnvironmentVariables() {
  const { error } = dotenv.config();
  const requiredVars = ["SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_PORT", "SMTP_TLS", "RABBITMQ_HOST"];

  for (const key of requiredVars) {
    const val = process.env[key]?.trim();
    if (val) continue;
    console.error(`ERROR: Missing Environment Variable '${key}'`);
    process.exit(1);
  }
}
