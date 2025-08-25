import type { Student, Course, Certificate, InsertStudent, InsertCourse, InsertCertificate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Student operations
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByPhone(phone: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student>;
  
  // Course operations
  getCourse(id: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Certificate operations
  getAllCertificates(): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  
  // Enrollment operations
  enrollStudentInCourse(studentId: string, courseId: string): Promise<Student>;
}

export class MemStorage implements IStorage {
  private students: Map<string, Student>;
  private courses: Map<string, Course>;
  private certificates: Map<string, Certificate>;

  constructor() {
    this.students = new Map();
    this.courses = new Map();
    this.certificates = new Map();
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
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student> {
    const student = this.students.get(id);
    if (!student) {
      throw new Error("Student not found");
    }
    
    const updatedStudent = { ...student, ...updates };
    this.students.set(id, updatedStudent);
    return updatedStudent;
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
    };
    this.courses.set(id, course);
    return course;
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
    };
    this.certificates.set(id, certificate);
    return certificate;
  }

  // Enrollment operations
  async enrollStudentInCourse(studentId: string, courseId: string): Promise<Student> {
    const student = this.students.get(studentId);
    const course = this.courses.get(courseId);
    
    if (!student || !course) {
      throw new Error("Student or course not found");
    }

    // Check if already enrolled
    const enrolledCourses = Array.isArray(student.enrolledCourses) ? student.enrolledCourses : [];
    if (!enrolledCourses.includes(courseId)) {
      const updatedStudent = {
        ...student,
        enrolledCourses: [...enrolledCourses, courseId]
      };
      this.students.set(studentId, updatedStudent);
      
      // Update course enrollment count
      const currentCount = parseInt(course.enrollmentCount || "0");
      const updatedCourse = {
        ...course,
        enrollmentCount: (currentCount + 1).toString()
      };
      this.courses.set(courseId, updatedCourse);
      
      return updatedStudent;
    }
    
    return student;
  }
}

export const storage = new MemStorage();
