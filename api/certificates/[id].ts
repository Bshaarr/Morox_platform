import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "../_lib/http";
import { ensureInitialized } from "../_lib/init";
import { storage } from "../../server/storage";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await ensureInitialized();
  const url = new URL(req.url || "/", "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (req.method === "DELETE") {
    const ok = await storage.deleteCertificate(id);
    sendJson(res, ok ? 200 : 404, { ok });
    return;
  }
  sendJson(res, 405, { message: "Method Not Allowed" });
}