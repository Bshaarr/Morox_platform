import type { Student, Course, Certificate, InsertStudent, InsertCourse, InsertCertificate, Announcement, InsertAnnouncement } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Student operations
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByPhone(phone: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: string): Promise<boolean>;

  // Course operations
  getCourse(id: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, updates: Partial<Course>): Promise<Course>;
  deleteCourse(id: string): Promise<boolean>;

  // Certificate operations
  getAllCertificates(): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  deleteCertificate(id: string): Promise<boolean>;

  // Enrollment operations
  enrollStudentInCourse(studentId: string, courseId: string): Promise<Student>;

  // Announcement operations
  getAllAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private students: Map<string, Student>;
  private courses: Map<string, Course>;
  private certificates: Map<string, Certificate>;
  private announcements: Map<string, Announcement>;

  constructor() {
    this.students = new Map();
    this.courses = new Map();
    this.certificates = new Map();
    this.announcements = new Map();
  }

  // Student operations
  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByPhone(phone: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.phone === phone,
    );
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = {
      ...insertStudent,
      id,
      enrolledCourses: [],
      certificates: [],
      createdAt: new Date(),
    } as Student;
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student> {
    const student = this.students.get(id);
    if (!student) {
      throw new Error("Student not found");
    }

    const updatedStudent = { ...student, ...updates } as Student;
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<boolean> {
    return this.students.delete(id);
  }

  // Course operations
  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      ...insertCourse,
      id,
      isActive: true,
      enrollmentCount: "0",
      createdAt: new Date(),
    } as Course;
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const course = this.courses.get(id);
    if (!course) throw new Error("Course not found");
    const updatedCourse = { ...course, ...updates } as Course;
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: string): Promise<boolean> {
    return this.courses.delete(id);
  }

  // Certificate operations
  async getAllCertificates(): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).sort((a, b) => 
      new Date(b.issueDate || 0).getTime() - new Date(a.issueDate || 0).getTime()
    );
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = randomUUID();
    const certificate: Certificate = {
      id,
      studentId: insertCertificate.studentId || null,
      courseId: insertCertificate.courseId || null,
      certificateUrl: insertCertificate.certificateUrl || null,
      verificationCode: insertCertificate.verificationCode,
      issueDate: new Date(),
    } as Certificate;
    this.certificates.set(id, certificate);
    return certificate;
  }

  async deleteCertificate(id: string): Promise<boolean> {
    return this.certificates.delete(id);
  }

  // Enrollment operations
  async enrollStudentInCourse(studentId: string, courseId: string): Promise<Student> {
    const student = this.students.get(studentId);
    const course = this.courses.get(courseId);

    if (!student || !course) {
      throw new Error("Student or course not found");
    }

    const enrolledCourses = Array.isArray(student.enrolledCourses) ? student.enrolledCourses : [];
    if (!enrolledCourses.includes(courseId)) {
      const updatedStudent = {
        ...student,
        enrolledCourses: [...enrolledCourses, courseId]
      } as Student;
      this.students.set(studentId, updatedStudent);

      const currentCount = parseInt(course.enrollmentCount || "0");
      const updatedCourse = {
        ...course,
        enrollmentCount: (currentCount + 1).toString()
      } as Course;
      this.courses.set(courseId, updatedCourse);

      return updatedStudent;
    }

    return student;
  }

  // Announcement operations
  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const announcement: Announcement = {
      id,
      title: insertAnnouncement.title,
      content: insertAnnouncement.content,
      isActive: true,
      createdAt: new Date(),
    } as Announcement;
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
    const current = this.announcements.get(id);
    if (!current) throw new Error("Announcement not found");
    const updated = { ...current, ...updates } as Announcement;
    this.announcements.set(id, updated);
    return updated;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    return this.announcements.delete(id);
  }
}

export const storage = new MemStorage();

export function getStorage(): IStorage {
  try {
    if (process.env.DATABASE_URL) {
      const { PgStorage } = require("./storage.pg");
      return new PgStorage();
    }
  } catch {}
  return storage;
}
