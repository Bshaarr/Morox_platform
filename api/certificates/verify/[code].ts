import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "../../_lib/http";
import { ensureInitialized } from "../../_lib/init";
import { storage } from "../../../server/storage";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await ensureInitialized();
    if (req.method !== "GET") {
      sendJson(res, 405, { message: "Method Not Allowed" });
      return;
    }
    const url = new URL(req.url || "/", "http://localhost");
    const pathParts = url.pathname.split("/").filter(Boolean);
    const code = decodeURIComponent(pathParts[pathParts.length - 1] || "");

    const certificates = await storage.getAllCertificates();
    const certificate = certificates.find((c) => c.verificationCode === code);
    if (!certificate) {
      sendJson(res, 404, { message: "الشهادة غير موجودة" });
      return;
    }
    const student = certificate.studentId ? await storage.getStudent(certificate.studentId) : null;
    const course = certificate.courseId ? await storage.getCourse(certificate.courseId) : null;
    sendJson(res, 200, { certificate, student, course, isValid: true });
  } catch (e) {
    sendJson(res, 500, { message: "خطأ في التحقق من الشهادة" });
  }
}