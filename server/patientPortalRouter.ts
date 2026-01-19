import type {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from "express";

import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { signInWithPassword, signUp } from "./_core/supabase";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  getVisitNotesByAppointment,
  getUpcomingAppointments,
  getPatientBySupabaseId,
  getAppointmentHistory,
  getAppointmentById,
} from "./db";

export const patientPortalRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        fullName: z.string().min(1),
        patientData: z.object({
          name: z.string(),
          dateOfBirth: z.string(),
          gender: z.enum(["male", "female", "other"]),
          phone: z.string(),
          address: z.string().optional(),
          emergencyContactName: z.string().optional(),
          emergencyContactPhone: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create Supabase user account
      const { user, session } = await signUp(
        ctx.req as unknown as ExpressRequest,
        ctx.res as unknown as ExpressResponse,
        input.email,
        input.password,
        {
          data: {
            full_name: input.fullName,
            patient_data: JSON.stringify(input.patientData),
          },
        }
      );

      return {
        success: true,
        userId: user.id,
        needsEmailConfirmation: !session,
      };
    }),

  login: publicProcedure
    .input(z.object({ email: z.email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { user } = await signInWithPassword(
          ctx.req as unknown as ExpressRequest,
          ctx.res as unknown as ExpressResponse,
          input.email,
          input.password
        );

        // Get the patient record associated with this user
        const patient = await getPatientBySupabaseId(user.id);

        return {
          success: true,
          userId: user.id,
          patientId: patient?.id,
          hasPatientRecord: !!patient,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Invalid credentials")
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed",
        });
      }
    }),

  getUpcomingAppointments: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "patient") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Patient access required",
      });
    }

    // Get patient ID from user
    const patient = await getPatientBySupabaseId(ctx.user.supabaseId ?? "");
    if (!patient) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Patient record not found",
      });
    }

    return await getUpcomingAppointments(patient.id);
  }),

  getAppointmentHistory: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "patient") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Patient access required",
      });
    }

    // Get patient ID from user
    const patient = await getPatientBySupabaseId(ctx.user.supabaseId ?? "");
    if (!patient) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Patient record not found",
      });
    }

    return await getAppointmentHistory(patient.id);
  }),

  getAppointmentDetails: protectedProcedure
    .input(z.object({ appointmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "patient") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Patient access required",
        });
      }

      const appointment = await getAppointmentById(input.appointmentId);
      if (!appointment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Appointment not found",
        });
      }

      // Get patient ID from user
      const patient = await getPatientBySupabaseId(ctx.user.supabaseId ?? "");
      if (!patient || appointment.patientId !== patient.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
      }

      const { doctors } = await import("../drizzle/schema");
      const { getDb } = await import("./db");
      const db = await getDb();

      const doctor = db
        ? await db
            .select()
            .from(doctors)
            .where(eq(doctors.id, appointment.doctorId))
            .limit(1)
        : [];
      const visitNote = await getVisitNotesByAppointment(appointment.id);

      return {
        appointment,
        doctor: doctor.length > 0 ? doctor[0] : null,
        visitNote,
      };
    }),
});
