import Joi from "joi";

export function stringToBool(string?: string) {
  if (!string) return false;
  string = string.trim();

  if (string === "false") return false;
  if (string === "0") return false;
  if (string === "no") return false;

  return true;
}

export async function wait(ms: number) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(null), ms));
}

export function validateBody(body: any) {
  const schema = Joi.object({
    to: Joi.string().email().required().lowercase().trim(),
    subject: Joi.string().trim(),
    text: Joi.string().trim(),
    html: Joi.string().trim(),
  }).or("text", "html");

  return schema.validate(body);
}

export function parseJSON(string: string): object {
  try {
    return JSON.parse(string);
  } catch (err) {
    console.error(err, `failed to parse json ${string}`);
    return {};
  }
}
