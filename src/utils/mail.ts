import nodemailer, { Transporter } from "nodemailer";
import { stringToBool, wait } from "./misc";

let transporter: Transporter;

export function createMailerTransport() {
  const user = process.env.SMTP_USERNAME!;
  const serviceClient = process.env.SMTP_SERVICE_CLIENT;
  const privateKey = process.env.SMTP_PRIVATE_KEY;
  const pass = process.env.SMTP_PASSWORD;

  let auth: any;

  if (!pass && (!serviceClient || !privateKey)) {
    throw new Error(
      `Either provide SMTP_PASSWORD or SMTP_SERVICE_CLIENT and SMTP_PRIVATE_KEY`
    );
  }

  if (serviceClient && privateKey) {
    auth = {
      user,
      type: "OAuth2",
      serviceClient: serviceClient,
      privateKey: privateKey,
    };
  } else if (pass) {
    auth = {
      user,
      pass,
    };
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: +process.env.SMTP_PORT!,
    secure: stringToBool(process.env.SMTP_TLS),
    auth,
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

    console.log(
      `Mail Sent '${args.subject}' => ${args.to} (${info.messageId})`
    );
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
