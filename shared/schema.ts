import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  enrolledCourses: jsonb("enrolled_courses").default([]),
  certificates: jsonb("certificates").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  detailedDescription: text("detailed_description"),
  category: text("category").notNull(), // "ai-skills", "academic", "specialty"
  duration: text("duration").notNull(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true),
  enrollmentCount: text("enrollment_count").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id),
  courseId: varchar("course_id").references(() => courses.id),
  issueDate: timestamp("issue_date").defaultNow(),
  certificateUrl: text("certificate_url"),
  verificationCode: text("verification_code").notNull().unique(),
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  name: true,
  phone: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  detailedDescription: true,
  category: true,
  duration: true,
  icon: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  studentId: true,
  courseId: true,
  certificateUrl: true,
  verificationCode: true,
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  title: true,
  content: true,
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
