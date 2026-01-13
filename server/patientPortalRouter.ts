import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getPatientAccountByEmail,
  getPatientAccountByPatientId,
  createPatientAccount,
  getPatientById,
  getUpcomingAppointments,
  getAppointmentHistory,
  getAppointmentById,
  getVisitNotesByAppointment,
} from "./db";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { users, doctors } from "../drizzle/schema";

export const patientPortalRouter = router({
  register: publicProcedure
    .input(
      z.object({
        patientId: z.number(),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = drizzle(process.env.DATABASE_URL!);

      const patient = await getPatientById(input.patientId);
      if (!patient) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Patient not found" });
      }

      const existingAccount = await getPatientAccountByEmail(input.email);
      if (existingAccount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Email already registered" });
      }

      const userResult = await db.insert(users).values({
        openId: `patient-${input.patientId}-${Date.now()}`,
        email: input.email,
        name: patient.name,
        role: "patient",
        loginMethod: "email",
      });

      const userId = userResult[0].insertId as number;

      const crypto = await import("crypto");
      const passwordHash = crypto.createHash("sha256").update(input.password).digest("hex");

      await createPatientAccount(input.patientId, userId, input.email, passwordHash);

      return { success: true, userId };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const account = await getPatientAccountByEmail(input.email);
      if (!account) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }

      const crypto = await import("crypto");
      const passwordHash = crypto.createHash("sha256").update(input.password).digest("hex");
      if (passwordHash !== account.passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }

      if (!account.isActive) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Account is inactive" });
      }

      return { success: true, userId: account.userId, patientId: account.patientId };
    }),

  getUpcomingAppointments: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "patient") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Patient access required" });
    }

    const account = await getPatientAccountByPatientId(ctx.user.id);
    if (!account) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Patient account not found" });
    }

    return await getUpcomingAppointments(account.patientId);
  }),

  getAppointmentHistory: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "patient") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Patient access required" });
    }

    const account = await getPatientAccountByPatientId(ctx.user.id);
    if (!account) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Patient account not found" });
    }

    return await getAppointmentHistory(account.patientId);
  }),

  getAppointmentDetails: protectedProcedure
    .input(z.object({ appointmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "patient") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Patient access required" });
      }

      const appointment = await getAppointmentById(input.appointmentId);
      if (!appointment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Appointment not found" });
      }

      const account = await getPatientAccountByPatientId(ctx.user.id);
      if (!account || appointment.patientId !== account.patientId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
      }

      const db = drizzle(process.env.DATABASE_URL!);
      const doctor = await db.select().from(doctors).where(eq(doctors.id, appointment.doctorId)).limit(1);
      const visitNote = await getVisitNotesByAppointment(appointment.id);

      return {
        appointment,
        doctor: doctor.length > 0 ? doctor[0] : null,
        visitNote,
      };
    }),
});
