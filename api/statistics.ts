import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "./_lib/http";
import { ensureInitialized } from "./_lib/init";
import { storage } from "../server/storage";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await ensureInitialized();
    if (req.method !== "GET") {
      sendJson(res, 405, { message: "Method Not Allowed" });
      return;
    }
    const students = await storage.getAllStudents();
    const courses = await storage.getAllCourses();
    const certificates = await storage.getAllCertificates();
    const stats = {
      totalStudents: students.length,
      totalCourses: courses.length,
      totalCertificates: certificates.length,
      activeCourses: courses.filter((c) => c.isActive).length,
      recentStudents: students.slice(-5).reverse(),
      popularCourses: courses
        .sort((a, b) => parseInt(b.enrollmentCount || "0") - parseInt(a.enrollmentCount || "0"))
        .slice(0, 5),
    };
    sendJson(res, 200, stats);
  } catch (e) {
    sendJson(res, 500, { message: "خطأ في جلب الإحصائيات" });
  }
}