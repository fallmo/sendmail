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
