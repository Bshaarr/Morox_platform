import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "./_lib/http";
import { ensureInitialized } from "./_lib/init";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    sendJson(res, 405, { message: "Method Not Allowed" });
    return;
  }
  await ensureInitialized();
  sendJson(res, 200, { message: "تم تهيئة البيانات بنجاح" });
}