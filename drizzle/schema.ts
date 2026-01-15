import { integer, pgEnum, pgTable, text, timestamp, varchar, date, serial, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define enums for PostgreSQL
export const roleEnum = pgEnum("role", ["admin", "receptionist", "doctor", "patient"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const appointmentStatusEnum = pgEnum("status", ["scheduled", "completed", "cancelled", "no_show"]);

/**
 * Core user table backing auth flow and role-based access control.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("patient").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Doctor profiles with specialty and contact information.
 * Links to users table for authentication.
 */
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  licenseNumber: varchar("licenseNumber", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = typeof doctors.$inferInsert;

/**
 * Patient demographic data and contact information.
 */
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  dateOfBirth: date("dateOfBirth").notNull(),
  gender: genderEnum("gender").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address"),
  email: varchar("email", { length: 320 }),
  emergencyContactName: varchar("emergencyContactName", { length: 255 }),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

/**
 * Appointments linking patients and doctors with time slots and status tracking.
 */
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patientId").notNull(),
  doctorId: integer("doctorId").notNull(),
  appointmentDate: date("appointmentDate").notNull(),
  appointmentTime: varchar("appointmentTime", { length: 5 }).notNull(), // HH:MM format
  status: appointmentStatusEnum("status").default("scheduled").notNull(),
  reason: text("reason"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Clinical visit notes created after appointment completion.
 * Stores diagnosis, treatment, prescriptions, and follow-up advice.
 */
export const visitNotes = pgTable("visit_notes", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointmentId").notNull(),
  doctorId: integer("doctorId").notNull(),
  patientId: integer("patientId").notNull(),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  prescriptions: text("prescriptions"),
  followUp: text("followUp"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type VisitNote = typeof visitNotes.$inferSelect;
export type InsertVisitNote = typeof visitNotes.$inferInsert;

/**
 * Audit trail for logging system actions.
 * Captures logins, appointment modifications, and clinical note entries.
 */
export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: integer("entityId"),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;

/**
 * Relations for foreign key constraints and type safety.
 */
export const doctorsRelations = relations(doctors, ({ one }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
}));

export const visitNotesRelations = relations(visitNotes, ({ one }) => ({
  appointment: one(appointments, {
    fields: [visitNotes.appointmentId],
    references: [appointments.id],
  }),
  doctor: one(doctors, {
    fields: [visitNotes.doctorId],
    references: [doctors.id],
  }),
  patient: one(patients, {
    fields: [visitNotes.patientId],
    references: [patients.id],
  }),
}));

export const logsRelations = relations(logs, ({ one }) => ({
  user: one(users, {
    fields: [logs.userId],
    references: [users.id],
  }),
}));


/**
 * Patient accounts for patient portal login.
 * Links patients to user accounts for authentication.
 */
export const patientAccounts = pgTable("patient_accounts", {
  id: serial("id").primaryKey(),
  patientId: integer("patientId").notNull().unique(),
  userId: integer("userId").notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PatientAccount = typeof patientAccounts.$inferSelect;
export type InsertPatientAccount = typeof patientAccounts.$inferInsert;

/**
 * Relations for patient accounts.
 */
export const patientAccountsRelations = relations(patientAccounts, ({ one }) => ({
  patient: one(patients, {
    fields: [patientAccounts.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [patientAccounts.userId],
    references: [users.id],
  }),
}));
