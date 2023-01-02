import nodemailer, { Transporter } from "nodemailer";
import { stringToBool, wait } from "./misc";

let transporter: Transporter;

export function createMailerTransport() {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: +process.env.SMTP_PORT!,
    secure: stringToBool(process.env.SMTP_TLS),
    auth: {
      user: process.env.SMTP_USERNAME!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });
}

export async function sendMail(
  args: { to: string; subject?: string; text: string; html?: string },
  retries = 0
): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_NAME
        ? `${process.env.SMTP_NAME} <${process.env.SMTP_USERNAME}>`
        : process.env.SMTP_USERNAME,
      to: args.to,
      subject: args.subject,
      text: args.text,
      html: args.html,
    });

    console.log(`Mail Sent '${args.subject}' => ${args.to} (${info.messageId})`);
    return true;
  } catch (err) {
    console.log(err);
    console.log(`Error Mailing '${args.subject}' => ${args.to}`);

    if (retries <= 0) return false;
    console.log("retrying in 3 seconds...");
    await wait(3000);

    return sendMail(args, retries - 1);
  }
}
