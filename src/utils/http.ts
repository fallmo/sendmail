import { createServer, IncomingMessage } from "http";
import Joi from "joi";
import { sendMail } from "./mail";
import { validateBody } from "./misc";

const server = createServer(async (req, res) => {
  // accept / and respond with status 200 and ok for testing
  if (req.method !== "POST" || req.url !== "/send-mail") {
    res.writeHead(404, { "content-type": "application/json" });
    return res.end(JSON.stringify({ error: "404 not found" }));
  }

  const body = await parseBody(req);
  const { error, value: fields } = validateBody(body);

  if (error) return res.end(JSON.stringify({ error: error.message }));

  const success = await sendMail({ to: fields.to, subject: fields.subject, text: fields.text, html: fields.html }, 2);
  if (!success) return res.end(JSON.stringify({ error: `Failed to email ${fields.to}` }));

  return res.end(JSON.stringify({ ok: true }));
});

async function parseBody(req: IncomingMessage) {
  if (req.headers["content-type"] !== "application/json") return {};
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

export function listenHttp() {
  const PORT = process.env.PORT || "8080";
  server.listen(+PORT);
  console.log(`HTTP server listening on port ${PORT}`);
}
