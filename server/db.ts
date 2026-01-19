import { type InsertUser, users } from "../drizzle/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { ENV } from "./_core/env";
import { eq } from "drizzle-orm";

import postgres from "postgres";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: postgres.Sql | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// New function: Get user by Supabase ID (for Supabase migration)
export async function getUserBySupabaseId(supabaseId: string) {
  const db = await getDb();
  if (!db) {
    console.warn(
      "[Database] Cannot get user by Supabase ID: database not available"
    );
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.supabaseId, supabaseId))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error getting user by Supabase ID:", error);
    return undefined;
  }
}

// User queries
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users);
}

// Doctor queries
export async function getDoctorByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { doctors } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(doctors)
    .where(eq(doctors.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllDoctors() {
  const db = await getDb();
  if (!db) return [];
  const { doctors } = await import("../drizzle/schema");
  return await db.select().from(doctors);
}

// Patient queries
export async function getPatientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { patients } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(patients)
    .where(eq(patients.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Get patient by Supabase ID (via user lookup)
export async function getPatientBySupabaseId(supabaseId: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    // First get the user by supabaseId
    const user = await getUserBySupabaseId(supabaseId);
    if (!user) return undefined;

    // Then get the patient by userId
    const { patients } = await import("../drizzle/schema");
    const { users } = await import("../drizzle/schema");

    // Since we don't have a direct patient-user relationship in the schema,
    // we need to check if there's a patientAccounts entry or return the patient
    // based on the user's email matching patient email

    // For now, return patient matching the user's email
    const result = await db
      .select()
      .from(patients)
      .where(eq(patients.email, user.email ?? ""))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error getting patient by Supabase ID:", error);
    return undefined;
  }
}

export async function searchPatients(query: string) {
  const db = await getDb();
  if (!db) return [];
  const { patients } = await import("../drizzle/schema");
  const { or, like } = await import("drizzle-orm");
  return await db
    .select()
    .from(patients)
    .where(
      or(like(patients.name, `%${query}%`), like(patients.phone, `%${query}%`))
    );
}

export async function getAllPatients() {
  const db = await getDb();
  if (!db) return [];
  const { patients } = await import("../drizzle/schema");
  return await db.select().from(patients);
}

// Appointment queries
export async function getAppointmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { appointments } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAppointmentsByDoctor(doctorId: number, date?: string) {
  const db = await getDb();
  if (!db) return [];
  const { appointments } = await import("../drizzle/schema");
  if (date) {
    const { and } = await import("drizzle-orm");
    const dateObj = new Date(date);
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          eq(appointments.appointmentDate, dateObj.toISOString())
        )
      );
  }
  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.doctorId, doctorId));
}

export async function getAppointmentsByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  const { appointments } = await import("../drizzle/schema");
  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.patientId, patientId));
}

// Visit notes queries
export async function getVisitNotesByAppointment(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { visitNotes } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(visitNotes)
    .where(eq(visitNotes.appointmentId, appointmentId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getVisitNotesByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  const { visitNotes } = await import("../drizzle/schema");
  return await db
    .select()
    .from(visitNotes)
    .where(eq(visitNotes.patientId, patientId));
}

// Logging queries
export async function createLog(
  userId: number,
  action: string,
  entityType?: string,
  entityId?: number,
  details?: string
) {
  const db = await getDb();
  if (!db) return;
  const { logs } = await import("../drizzle/schema");
  await db.insert(logs).values({
    userId,
    action,
    entityType,
    entityId,
    details,
  });
}

// Patient account queries
export async function getPatientAccountByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const { patientAccounts } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(patientAccounts)
    .where(eq(patientAccounts.email, email))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPatientAccountByPatientId(patientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { patientAccounts } = await import("../drizzle/schema");
  const result = await db
    .select()
    .from(patientAccounts)
    .where(eq(patientAccounts.patientId, patientId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPatientAccount(
  patientId: number,
  userId: number,
  email: string,
  passwordHash: string
) {
  const db = await getDb();
  if (!db) return;
  const { patientAccounts } = await import("../drizzle/schema");
  await db.insert(patientAccounts).values({
    patientId,
    userId,
    email,
    passwordHash,
    isActive: true,
  });
}

// Patient appointment queries with doctor info
export async function getPatientAppointmentsWithDoctor(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  const { appointments, doctors, patients } = await import("../drizzle/schema");
  return await db
    .select({
      appointment: appointments,
      doctor: doctors,
      patient: patients,
    })
    .from(appointments)
    .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.patientId, patientId));
}

export async function getUpcomingAppointments(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  const { appointments, doctors } = await import("../drizzle/schema");
  const { and, gte, eq: eqOp } = await import("drizzle-orm");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return await db
    .select({
      appointment: appointments,
      doctor: doctors,
    })
    .from(appointments)
    .leftJoin(doctors, eqOp(appointments.doctorId, doctors.id))
    .where(
      and(
        eqOp(appointments.patientId, patientId),
        gte(appointments.appointmentDate, today.toISOString()),
        eqOp(appointments.status, "scheduled")
      )
    );
}

export async function getAppointmentHistory(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  const { appointments, doctors, visitNotes } = await import(
    "../drizzle/schema"
  );
  const { eq: eqOp } = await import("drizzle-orm");
  return await db
    .select({
      appointment: appointments,
      doctor: doctors,
      visitNote: visitNotes,
    })
    .from(appointments)
    .leftJoin(doctors, eqOp(appointments.doctorId, doctors.id))
    .leftJoin(visitNotes, eqOp(appointments.id, visitNotes.appointmentId))
    .where(eqOp(appointments.patientId, patientId));
}
