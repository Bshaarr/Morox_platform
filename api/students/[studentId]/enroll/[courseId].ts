import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "../../../../_lib/http";
import { ensureInitialized } from "../../../../_lib/init";
import { storage } from "../../../../../server/storage";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await ensureInitialized();
    if (req.method !== "POST") {
      sendJson(res, 405, { message: "Method Not Allowed" });
      return;
    }
    const url = new URL(req.url || "/", "http://localhost");
    const parts = url.pathname.split("/").filter(Boolean);
    const studentId = decodeURIComponent(parts[parts.length - 3] || "");
    const courseId = decodeURIComponent(parts[parts.length - 1] || "");

    const student = await storage.getStudent(studentId);
    const course = await storage.getCourse(courseId);
    if (!student || !course) {
      sendJson(res, 404, { message: "الطالب أو الدورة غير موجود" });
      return;
    }
    const updatedStudent = await storage.enrollStudentInCourse(studentId, courseId);
    sendJson(res, 200, updatedStudent);
  } catch (e) {
    sendJson(res, 500, { message: "خطأ في التسجيل" });
  }
}