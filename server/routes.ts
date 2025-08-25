import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertCourseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default courses on server start
  await initializeDefaultCourses();

  // Student login/registration
  app.post("/api/students/login", async (req, res) => {
    try {
      const data = insertStudentSchema.parse(req.body);
      
      // Check if student exists
      let student = await storage.getStudentByPhone(data.phone);
      
      if (!student) {
        // Create new student
        student = await storage.createStudent(data);
      } else {
        // Update student name if different
        if (student.name !== data.name) {
          student = await storage.updateStudent(student.id, { name: data.name });
        }
      }
      
      res.json(student);
    } catch (error) {
      console.error("Student login error:", error);
      res.status(400).json({ message: "خطأ في البيانات المدخلة" });
    }
  });

  // Get all students (admin only)
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      console.error("Get students error:", error);
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });

  // Create new course (admin only)
  app.post("/api/courses", async (req, res) => {
    try {
      const data = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(data);
      res.json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(400).json({ message: "خطأ في البيانات المدخلة" });
    }
  });

  // Get all certificates (admin only)
  app.get("/api/certificates", async (req, res) => {
    try {
      const certificates = await storage.getAllCertificates();
      res.json(certificates);
    } catch (error) {
      console.error("Get certificates error:", error);
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });

  // Enroll student in course
  app.post("/api/students/:studentId/enroll/:courseId", async (req, res) => {
    try {
      const { studentId, courseId } = req.params;
      
      const student = await storage.getStudent(studentId);
      const course = await storage.getCourse(courseId);
      
      if (!student || !course) {
        return res.status(404).json({ message: "الطالب أو الدورة غير موجود" });
      }

      const updatedStudent = await storage.enrollStudentInCourse(studentId, courseId);
      res.json(updatedStudent);
    } catch (error) {
      console.error("Enrollment error:", error);
      res.status(500).json({ message: "خطأ في التسجيل" });
    }
  });

  // Issue certificate
  app.post("/api/certificates", async (req, res) => {
    try {
      const { studentId, courseId } = req.body;
      
      const student = await storage.getStudent(studentId);
      const course = await storage.getCourse(courseId);
      
      if (!student || !course) {
        return res.status(404).json({ message: "الطالب أو الدورة غير موجود" });
      }

      // Generate verification code
      const verificationCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const certificate = await storage.createCertificate({
        studentId,
        courseId,
        verificationCode,
        certificateUrl: `/certificates/${verificationCode}.pdf`
      });
      
      res.json(certificate);
    } catch (error) {
      console.error("Certificate creation error:", error);
      res.status(500).json({ message: "خطأ في إنشاء الشهادة" });
    }
  });

  // Verify certificate by code
  app.get("/api/certificates/verify/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const certificates = await storage.getAllCertificates();
      const certificate = certificates.find(cert => cert.verificationCode === code);
      
      if (!certificate) {
        return res.status(404).json({ message: "الشهادة غير موجودة" });
      }

      const student = await storage.getStudent(certificate.studentId!);
      const course = await storage.getCourse(certificate.courseId!);
      
      res.json({
        certificate,
        student,
        course,
        isValid: true
      });
    } catch (error) {
      console.error("Certificate verification error:", error);
      res.status(500).json({ message: "خطأ في التحقق من الشهادة" });
    }
  });

  // Get platform statistics (admin only)
  app.get("/api/statistics", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      const courses = await storage.getAllCourses();
      const certificates = await storage.getAllCertificates();
      
      const stats = {
        totalStudents: students.length,
        totalCourses: courses.length,
        totalCertificates: certificates.length,
        activeCourses: courses.filter(course => course.isActive).length,
        recentStudents: students.slice(-5).reverse(),
        popularCourses: courses.sort((a, b) => 
          parseInt(b.enrollmentCount || "0") - parseInt(a.enrollmentCount || "0")
        ).slice(0, 5)
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Statistics error:", error);
      res.status(500).json({ message: "خطأ في جلب الإحصائيات" });
    }
  });

  // Initialize default courses if none exist
  app.get("/api/init", async (req, res) => {
    try {
      await initializeDefaultCourses();
      res.json({ message: "تم تهيئة البيانات بنجاح" });
    } catch (error) {
      console.error("Initialization error:", error);
      res.status(500).json({ message: "خطأ في تهيئة البيانات" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeDefaultCourses() {
  try {
    const existingCourses = await storage.getAllCourses();
    
    if (existingCourses.length === 0) {
      const defaultCourses = [
        {
          title: "دورة اعداد مدربين",
          description: "تأهيل المدربين لتدريس مهارات الذكاء الاصطناعي",
          category: "ai-skills",
          duration: "4 أسابيع",
          icon: "graduation-cap"
        },
        {
          title: "دورة مهارات الذكاء الاصطناعي للطلاب",
          description: "تعليم الطلاب أساسيات وتطبيقات الذكاء الاصطناعي",
          category: "ai-skills",
          duration: "6 أسابيع",
          icon: "student"
        },
        {
          title: "دورة مهارات الذكاء الاصطناعي للمدرسين",
          description: "تمكين المدرسين من دمج الذكاء الاصطناعي في التعليم",
          category: "ai-skills",
          duration: "5 أسابيع",
          icon: "chalkboard-teacher"
        },
        {
          title: "دورة مهارات الذكاء الاصطناعي للآباء",
          description: "مساعدة الآباء على فهم ومراقبة استخدام أطفالهم للذكاء الاصطناعي",
          category: "ai-skills",
          duration: "3 أسابيع",
          icon: "heart"
        },
        {
          title: "دورة مهارات الذكاء الاصطناعي لصناع المحتوى",
          description: "استخدام الذكاء الاصطناعي في إنتاج وتحسين المحتوى الرقمي",
          category: "ai-skills",
          duration: "4 أسابيع",
          icon: "video"
        },
        {
          title: "دورة تصميم شخصية افتراضية",
          description: "إنشاء وتطوير شخصيات افتراضية ذكية تفاعلية",
          category: "ai-skills",
          duration: "6 أسابيع",
          icon: "robot"
        },
        {
          title: "دورة مهارات الذكاء الاصطناعي للمبرمجين",
          description: "تطوير تطبيقات ومشاريع ذكية باستخدام الذكاء الاصطناعي",
          category: "ai-skills",
          duration: "8 أسابيع",
          icon: "code"
        },
        {
          title: "دورة مهارات الذكاء الاصطناعي للمصممين",
          description: "استخدام أدوات الذكاء الاصطناعي في التصميم والإبداع البصري",
          category: "ai-skills",
          duration: "5 أسابيع",
          icon: "palette"
        },
        {
          title: "دورات تقوية لطلاب الصف التاسع",
          description: "دورات تقوية شاملة لجميع مواد الصف التاسع",
          category: "academic",
          duration: "فصل دراسي",
          icon: "book"
        },
        {
          title: "دورات متابعة لطلاب الصف التاسع",
          description: "متابعة مستمرة لطلاب الصف التاسع طوال العام الدراسي",
          category: "academic",
          duration: "سنة دراسية",
          icon: "users"
        },
        {
          title: "دورات تقوية لطلاب الثالث الثانوي - جميع الفروع",
          description: "دورات تقوية مكثفة لطلاب الثالث الثانوي في جميع التخصصات",
          category: "academic",
          duration: "فصل دراسي",
          icon: "graduation-cap"
        },
        {
          title: "دورات متابعة لطلاب الثالث الثانوي - جميع الفروع",
          description: "متابعة مستمرة لطلاب الثالث الثانوي في جميع التخصصات",
          category: "academic",
          duration: "سنة دراسية",
          icon: "users"
        }
      ];

      for (const courseData of defaultCourses) {
        await storage.createCourse(courseData);
      }
      
      console.log("Default courses initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing default courses:", error);
  }
}
