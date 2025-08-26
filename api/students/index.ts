import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "../_lib/http";
import { ensureInitialized } from "../_lib/init";
import { getStorage } from "../../server/storage";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await ensureInitialized();
    if (req.method !== "GET") {
      sendJson(res, 405, { message: "Method Not Allowed" });
      return;
    }
    const storage = getStorage();
    const students = await storage.getAllStudents();
    sendJson(res, 200, students);
  } catch {
    sendJson(res, 500, { message: "خطأ في الخادم" });
  }
}