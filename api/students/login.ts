import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJsonBody } from "../_lib/http";
import { ensureInitialized } from "../_lib/init";
import { getStorage } from "../../server/storage";
import { insertStudentSchema } from "../../shared/schema";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await ensureInitialized();
    if (req.method !== "POST") {
      sendJson(res, 405, { message: "Method Not Allowed" });
      return;
    }
    const data = insertStudentSchema.parse(await readJsonBody(req));
    const storage = getStorage();
    let student = await storage.getStudentByPhone(data.phone);
    if (!student) {
      student = await storage.createStudent(data);
    } else if (student.name !== data.name) {
      student = await storage.updateStudent(student.id, { name: data.name });
    }
    sendJson(res, 200, student);
  } catch (error: any) {
    sendJson(res, 400, { message: "خطأ في البيانات المدخلة" });
  }
}