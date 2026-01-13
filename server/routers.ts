import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { patientPortalRouter } from "./patientPortalRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getAllUsers,
  getUserById,
  getAllDoctors,
  getDoctorByUserId,
  getAllPatients,
  getPatientById,
  searchPatients,
  getAppointmentById,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getVisitNotesByAppointment,
  getVisitNotesByPatient,
  createLog,
  getPatientAccountByEmail,
  getPatientAccountByPatientId,
  createPatientAccount,
  getPatientAppointmentsWithDoctor,
  getUpcomingAppointments,
  getAppointmentHistory,
} from "./db";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import {
  users,
  doctors,
  patients,
  appointments,
  visitNotes,
  logs,
  patientAccounts,
  type InsertDoctor,
  type InsertPatient,
  type InsertAppointment,
  type InsertVisitNote,
} from "../drizzle/schema";

// Helper to check if user is admin
function requireAdmin(ctx: any) {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
}

// Helper to check if user is doctor
function requireDoctor(ctx: any) {
  if (ctx.user?.role !== "doctor") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Doctor access required" });
  }
}

// Helper to check if user is receptionist or admin
function requireReceptionist(ctx: any) {
  if (ctx.user?.role !== "receptionist" && ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Receptionist access required" });
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User management (Admin only)
  users: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      requireAdmin(ctx);
      return await getAllUsers();
    }),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
      requireAdmin(ctx);
      return await getUserById(input.id);
    }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          role: z.enum(["admin", "receptionist", "doctor"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireAdmin(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        await db.update(users).set({ role: input.role }).where(eq(users.id, input.id));
        await createLog(ctx.user.id, "UPDATE_USER_ROLE", "users", input.id, `Role changed to ${input.role}`);
        return { success: true };
      }),
  }),

  // Doctor management (Admin only)
  doctors: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getAllDoctors();
    }),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const db = drizzle(process.env.DATABASE_URL!);
      const result = await db.select().from(doctors).where(eq(doctors.id, input.id)).limit(1);
      return result.length > 0 ? result[0] : null;
    }),
    create: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          specialty: z.string().min(1),
          licenseNumber: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireAdmin(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        const result = await db.insert(doctors).values(input as InsertDoctor);
        await createLog(ctx.user.id, "CREATE_DOCTOR", "doctors", undefined, `Created doctor for user ${input.userId}`);
        return result;
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          specialty: z.string().optional(),
          licenseNumber: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireAdmin(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        const { id, ...updateData } = input;
        await db.update(doctors).set(updateData).where(eq(doctors.id, id));
        await createLog(ctx.user.id, "UPDATE_DOCTOR", "doctors", id);
        return { success: true };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      requireAdmin(ctx);
      const db = drizzle(process.env.DATABASE_URL!);
      await db.delete(doctors).where(eq(doctors.id, input.id));
      await createLog(ctx.user.id, "DELETE_DOCTOR", "doctors", input.id);
      return { success: true };
    }),
  }),

  // Patient management (Receptionist and Admin)
  patients: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      requireReceptionist(ctx);
      return await getAllPatients();
    }),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
      return await getPatientById(input.id);
    }),
    search: protectedProcedure.input(z.object({ query: z.string() })).query(async ({ input, ctx }) => {
      requireReceptionist(ctx);
      return await searchPatients(input.query);
    }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          dateOfBirth: z.string(),
          gender: z.enum(["male", "female", "other"]),
          phone: z.string().min(1),
          address: z.string().optional(),
          email: z.string().email().optional(),
          emergencyContactName: z.string().optional(),
          emergencyContactPhone: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireReceptionist(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        const patientData: InsertPatient = {
          ...input,
          dateOfBirth: new Date(input.dateOfBirth),
        };
        const result = await db.insert(patients).values(patientData);
        await createLog(ctx.user.id, "CREATE_PATIENT", "patients", undefined, `Created patient ${input.name}`);
        return result;
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          email: z.string().email().optional(),
          emergencyContactName: z.string().optional(),
          emergencyContactPhone: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireReceptionist(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        const { id, ...updateData } = input;
        await db.update(patients).set(updateData).where(eq(patients.id, id));
        await createLog(ctx.user.id, "UPDATE_PATIENT", "patients", id);
        return { success: true };
      }),
  }),

  // Appointment management
  appointments: router({
    list: protectedProcedure
      .input(z.object({ doctorId: z.number().optional(), patientId: z.number().optional(), date: z.string().optional() }))
      .query(async ({ input, ctx }) => {
        if (input.doctorId) {
          return await getAppointmentsByDoctor(input.doctorId, input.date);
        }
        if (input.patientId) {
          return await getAppointmentsByPatient(input.patientId);
        }
        const db = drizzle(process.env.DATABASE_URL!);
        return await db.select().from(appointments);
      }),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getAppointmentById(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          patientId: z.number(),
          doctorId: z.number(),
          appointmentDate: z.string(),
          appointmentTime: z.string(),
          reason: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireReceptionist(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        const appointmentData: InsertAppointment = {
          ...input,
          appointmentDate: new Date(input.appointmentDate),
          status: "scheduled",
        };
        const result = await db.insert(appointments).values(appointmentData);
        await createLog(
          ctx.user.id,
          "CREATE_APPOINTMENT",
          "appointments",
          undefined,
          `Appointment scheduled for patient ${input.patientId}`
        );
        return result;
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).optional(),
          appointmentTime: z.string().optional(),
          reason: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireReceptionist(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        const { id, ...updateData } = input;
        await db.update(appointments).set(updateData).where(eq(appointments.id, id));
        await createLog(ctx.user.id, "UPDATE_APPOINTMENT", "appointments", id, `Status: ${updateData.status}`);
        return { success: true };
      }),
    cancel: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      requireReceptionist(ctx);
      const db = drizzle(process.env.DATABASE_URL!);
      await db.update(appointments).set({ status: "cancelled" }).where(eq(appointments.id, input.id));
      await createLog(ctx.user.id, "CANCEL_APPOINTMENT", "appointments", input.id);
      return { success: true };
    }),
  }),

  // Visit notes (Doctor only)
  visitNotes: router({
    getByAppointment: protectedProcedure.input(z.object({ appointmentId: z.number() })).query(async ({ input }) => {
      return await getVisitNotesByAppointment(input.appointmentId);
    }),
    getByPatient: protectedProcedure.input(z.object({ patientId: z.number() })).query(async ({ input }) => {
      return await getVisitNotesByPatient(input.patientId);
    }),
    create: protectedProcedure
      .input(
        z.object({
          appointmentId: z.number(),
          doctorId: z.number(),
          patientId: z.number(),
          diagnosis: z.string().optional(),
          treatment: z.string().optional(),
          prescriptions: z.string().optional(),
          followUp: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireDoctor(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        const visitNoteData: InsertVisitNote = input;
        const result = await db.insert(visitNotes).values(visitNoteData);
        await createLog(ctx.user.id, "CREATE_VISIT_NOTE", "visit_notes", undefined, `Visit note for appointment ${input.appointmentId}`);
        return result;
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          diagnosis: z.string().optional(),
          treatment: z.string().optional(),
          prescriptions: z.string().optional(),
          followUp: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        requireDoctor(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        const { id, ...updateData } = input;
        await db.update(visitNotes).set(updateData).where(eq(visitNotes.id, id));
        await createLog(ctx.user.id, "UPDATE_VISIT_NOTE", "visit_notes", id);
        return { success: true };
      }),
  }),

  // Audit logs (Admin only)
  logs: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }))
      .query(async ({ input, ctx }) => {
        requireAdmin(ctx);
        const db = drizzle(process.env.DATABASE_URL!);
        return await db.select().from(logs).limit(input.limit).offset(input.offset);
      }),
  }),
  patientPortal: patientPortalRouter,
});

export type AppRouter = typeof appRouter;
