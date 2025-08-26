import { getStorage } from "../../server/storage";

let initialized = false;

export async function ensureInitialized() {
  if (initialized) return;
  const storage = getStorage();
  const existing = await storage.getAllCourses();
  // ensure DB schema on first call
  try { (await import("../../server/db-init")).ensureDatabaseSetup && await (await import("../../server/db-init")).ensureDatabaseSetup(); } catch {}
  if (existing.length === 0) {
    const defaultCourses = [
      {
        title: "دورة اعداد مدربين",
        description: "تأهيل المدربين لتدريس مهارات الذكاء الاصطناعي",
        category: "ai-skills",
        duration: "4 أسابيع",
        icon: "graduation-cap",
      },
      {
        title: "دورة مهارات الذكاء الاصطناعي للطلاب",
        description: "تعليم الطلاب أساسيات وتطبيقات الذكاء الاصطناعي",
        category: "ai-skills",
        duration: "6 أسابيع",
        icon: "student",
      },
      {
        title: "دورة مهارات الذكاء الاصطناعي للمدرسين",
        description: "تمكين المدرسين من دمج الذكاء الاصطناعي في التعليم",
        category: "ai-skills",
        duration: "5 أسابيع",
        icon: "chalkboard-teacher",
      },
      {
        title: "دورة مهارات الذكاء الاصطناعي للآباء",
        description: "مساعدة الآباء على فهم ومراقبة استخدام أطفالهم للذكاء الاصطناعي",
        category: "ai-skills",
        duration: "3 أسابيع",
        icon: "heart",
      },
      {
        title: "دورة مهارات الذكاء الاصطناعي لصناع المحتوى",
        description: "استخدام الذكاء الاصطناعي في إنتاج وتحسين المحتوى الرقمي",
        category: "ai-skills",
        duration: "4 أسابيع",
        icon: "video",
      },
      {
        title: "دورة تصميم شخصية افتراضية",
        description: "إنشاء وتطوير شخصيات افتراضية ذكية تفاعلية",
        category: "ai-skills",
        duration: "6 أسابيع",
        icon: "robot",
      },
      {
        title: "دورة مهارات الذكاء الاصطناعي للمبرمجين",
        description: "تطوير تطبيقات ومشاريع ذكية باستخدام الذكاء الاصطناعي",
        category: "ai-skills",
        duration: "8 أسابيع",
        icon: "code",
      },
      {
        title: "دورة مهارات الذكاء الاصطناعي للمصممين",
        description: "استخدام أدوات الذكاء الاصطناعي في التصميم والإبداع البصري",
        category: "ai-skills",
        duration: "5 أسابيع",
        icon: "palette",
      },
      {
        title: "دورات تقوية لطلاب الصف التاسع",
        description: "دورات تقوية شاملة لجميع مواد الصف التاسع",
        category: "academic",
        duration: "فصل دراسي",
        icon: "book",
      },
      {
        title: "دورات متابعة لطلاب الصف التاسع",
        description: "متابعة مستمرة لطلاب الصف التاسع طوال العام الدراسي",
        category: "academic",
        duration: "سنة دراسية",
        icon: "users",
      },
      {
        title: "دورات تقوية لطلاب الثالث الثانوي - جميع الفروع",
        description: "دورات تقوية مكثفة لطلاب الثالث الثانوي في جميع التخصصات",
        category: "academic",
        duration: "فصل دراسي",
        icon: "graduation-cap",
      },
      {
        title: "دورات متابعة لطلاب الثالث الثانوي - جميع الفروع",
        description: "متابعة مستمرة لطلاب الثالث الثانوي في جميع التخصصات",
        category: "academic",
        duration: "سنة دراسية",
        icon: "users",
      },
    ];
    for (const c of defaultCourses) {
      await storage.createCourse(c as any);
    }
  }
  initialized = true;
}