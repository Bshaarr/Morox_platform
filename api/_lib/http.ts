import type { IncomingMessage, ServerResponse } from "http";

export async function readJsonBody<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    try {
      const chunks: Buffer[] = [];
      req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      req.on("end", () => {
        if (chunks.length === 0) {
          resolve({} as T);
          return;
        }
        const raw = Buffer.concat(chunks).toString("utf8");
        try {
          resolve(JSON.parse(raw) as T);
        } catch (e) {
          reject(e);
        }
      });
      req.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

export function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export function getPathSegments(req: IncomingMessage): string[] {
  const url = new URL(req.url || "/", "http://localhost");
  return url.pathname.split("/").filter(Boolean);
}