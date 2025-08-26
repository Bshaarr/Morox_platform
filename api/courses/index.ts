import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJsonBody } from "../_lib/http";
import { ensureInitialized } from "../_lib/init";
import { getStorage } from "../../server/storage";
import { insertCourseSchema } from "../../shared/schema";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await ensureInitialized();
    if (req.method === "GET") {
      const storage = getStorage();
      const courses = await storage.getAllCourses();
      sendJson(res, 200, courses);
      return;
    }
    if (req.method === "POST") {
      const data = insertCourseSchema.parse(await readJsonBody(req));
      const storage = getStorage();
      const course = await storage.createCourse(data);
      sendJson(res, 200, course);
      return;
    }
    sendJson(res, 405, { message: "Method Not Allowed" });
  } catch (error: any) {
    if (req.method === "POST") {
      sendJson(res, 400, { message: "خطأ في البيانات المدخلة" });
    } else {
      sendJson(res, 500, { message: "خطأ في الخادم" });
    }
  }
}