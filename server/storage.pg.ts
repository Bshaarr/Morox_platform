import type { IStorage } from "./storage";
import { getDb } from "./db";
import { and, desc, eq, sql } from "drizzle-orm";
import {
	students as studentsTable,
	courses as coursesTable,
	certificates as certificatesTable,
	announcements as announcementsTable,
	type Student,
	type Course,
	type Certificate,
	type Announcement,
	type InsertStudent,
	type InsertCourse,
	type InsertCertificate,
	type InsertAnnouncement,
} from "@shared/schema";

export class PgStorage implements IStorage {
	private db = getDb()!;

	async getStudent(id: string): Promise<Student | undefined> {
		const [row] = await this.db.select().from(studentsTable).where(eq(studentsTable.id, id));
		return row as Student | undefined;
	}

	async getStudentByPhone(phone: string): Promise<Student | undefined> {
		const [row] = await this.db.select().from(studentsTable).where(eq(studentsTable.phone, phone));
		return row as Student | undefined;
	}

	async getAllStudents(): Promise<Student[]> {
		const rows = await this.db.select().from(studentsTable).orderBy(desc(studentsTable.createdAt));
		return rows as Student[];
	}

	async createStudent(insertStudent: InsertStudent): Promise<Student> {
		const [row] = await this.db.insert(studentsTable).values(insertStudent).returning();
		return row as Student;
	}

	async updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student> {
		const [row] = await this.db.update(studentsTable).set(updates).where(eq(studentsTable.id, id)).returning();
		if (!row) throw new Error("Student not found");
		return row as Student;
	}

	async getCourse(id: string): Promise<Course | undefined> {
		const [row] = await this.db.select().from(coursesTable).where(eq(coursesTable.id, id));
		return row as Course | undefined;
	}

	async getAllCourses(): Promise<Course[]> {
		const rows = await this.db.select().from(coursesTable).orderBy(desc(coursesTable.createdAt));
		return rows as Course[];
	}

	async createCourse(insertCourse: InsertCourse): Promise<Course> {
		const [row] = await this.db.insert(coursesTable).values(insertCourse as any).returning();
		return row as Course;
	}

	async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
		const [row] = await this.db.update(coursesTable).set(updates as any).where(eq(coursesTable.id, id)).returning();
		if (!row) throw new Error("Course not found");
		return row as Course;
	}

	async deleteCourse(id: string): Promise<boolean> {
		const result = await this.db.delete(coursesTable).where(eq(coursesTable.id, id));
		return (result as any).rowCount ? (result as any).rowCount > 0 : true;
	}

	async getAllCertificates(): Promise<Certificate[]> {
		const rows = await this.db.select().from(certificatesTable).orderBy(desc(certificatesTable.issueDate));
		return rows as Certificate[];
	}

	async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
		const [row] = await this.db.insert(certificatesTable).values(insertCertificate as any).returning();
		return row as Certificate;
	}

	async deleteCertificate(id: string): Promise<boolean> {
		const result = await this.db.delete(certificatesTable).where(eq(certificatesTable.id, id));
		return (result as any).rowCount ? (result as any).rowCount > 0 : true;
	}

	async enrollStudentInCourse(studentId: string, courseId: string): Promise<Student> {
		const student = await this.getStudent(studentId);
		const course = await this.getCourse(courseId);
		if (!student || !course) throw new Error("Student or course not found");
		const enrolledCourses = Array.isArray(student.enrolledCourses) ? student.enrolledCourses : [];
		if (!enrolledCourses.includes(courseId)) {
			const updatedStudent = await this.updateStudent(studentId, { enrolledCourses: [...enrolledCourses, courseId] } as any);
			const currentCount = parseInt(course.enrollmentCount || "0");
			await this.updateCourse(courseId, { enrollmentCount: String(currentCount + 1) } as any);
			return updatedStudent;
		}
		return student;
	}

	async getAllAnnouncements(): Promise<Announcement[]> {
		const rows = await this.db.select().from(announcementsTable).orderBy(desc(announcementsTable.createdAt));
		return rows as Announcement[];
	}

	async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
		const [row] = await this.db.insert(announcementsTable).values(insertAnnouncement as any).returning();
		return row as Announcement;
	}

	async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
		const [row] = await this.db.update(announcementsTable).set(updates as any).where(eq(announcementsTable.id, id)).returning();
		if (!row) throw new Error("Announcement not found");
		return row as Announcement;
	}

	async deleteAnnouncement(id: string): Promise<boolean> {
		const result = await this.db.delete(announcementsTable).where(eq(announcementsTable.id, id));
		return (result as any).rowCount ? (result as any).rowCount > 0 : true;
	}
}