export function validateEnvironmentVariables() {
  const requiredVars = ["SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_PORT", "SMTP_TLS"];

  for (const key of requiredVars) {
    const val = process.env[key]?.trim();
    if (val) continue;
    console.error(`ERROR: Missing Environment Variable '${key}'`);
    process.exit(1);
  }
}
