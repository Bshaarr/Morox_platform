import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJsonBody } from "../_lib/http";
import { ensureInitialized } from "../_lib/init";
import { storage } from "../../server/storage";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await ensureInitialized();
  const url = new URL(req.url || "/", "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  try {
    if (req.method === "PATCH" || req.method === "PUT") {
      const updates = await readJsonBody(req);
      const updated = await storage.updateAnnouncement(id, updates as any);
      sendJson(res, 200, updated);
      return;
    }
    if (req.method === "DELETE") {
      const ok = await storage.deleteAnnouncement(id);
      sendJson(res, ok ? 200 : 404, { ok });
      return;
    }
    sendJson(res, 405, { message: "Method Not Allowed" });
  } catch (e: any) {
    sendJson(res, 400, { message: e?.message || "Error" });
  }
}