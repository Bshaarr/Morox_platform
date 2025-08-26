import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJsonBody } from "../_lib/http";
import { ensureInitialized } from "../_lib/init";
import { storage } from "../../server/storage";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await ensureInitialized();
    if (req.method === "GET") {
      const certificates = await storage.getAllCertificates();
      sendJson(res, 200, certificates);
      return;
    }
    if (req.method === "POST") {
      const { studentId, courseId } = await readJsonBody<{ studentId: string; courseId: string }>(req);
      const students = await storage.getStudent(studentId);
      const course = await storage.getCourse(courseId);
      if (!students || !course) {
        sendJson(res, 404, { message: "الطالب أو الدورة غير موجود" });
        return;
      }
      const verificationCode = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const certificate = await storage.createCertificate({
        studentId,
        courseId,
        verificationCode,
        certificateUrl: `/certificates/${verificationCode}.pdf`,
      } as any);
      sendJson(res, 200, certificate);
      return;
    }
    sendJson(res, 405, { message: "Method Not Allowed" });
  } catch (e) {
    sendJson(res, 500, { message: "خطأ في إنشاء الشهادة" });
  }
}