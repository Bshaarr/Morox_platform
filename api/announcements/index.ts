import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJsonBody } from "../_lib/http";
import { ensureInitialized } from "../_lib/init";
import { getStorage } from "../../server/storage";
import { insertAnnouncementSchema } from "../../shared/schema";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await ensureInitialized();
  try {
    if (req.method === "GET") {
      const storage = getStorage();
      const announcements = await storage.getAllAnnouncements();
      sendJson(res, 200, announcements);
      return;
    }
    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const parsed = insertAnnouncementSchema.parse(body);
      const storage = getStorage();
      const created = await storage.createAnnouncement(parsed);
      sendJson(res, 200, created);
      return;
    }
    sendJson(res, 405, { message: "Method Not Allowed" });
  } catch (e: any) {
    sendJson(res, 400, { message: e?.message || "Error" });
  }
}