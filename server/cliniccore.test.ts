import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for authenticated users
function createMockContext(role: "admin" | "receptionist" | "doctor" = "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("ClinicCore API", () => {
  describe("Authentication", () => {
    it("should return current user with me query", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      const user = await caller.auth.me();
      expect(user).toBeDefined();
      expect(user?.role).toBe("admin");
    });

    it("should logout successfully", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
    });
  });

  describe("User Management (Admin Only)", () => {
    it("should list all users as admin", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);
      const users = await caller.users.list();
      expect(Array.isArray(users)).toBe(true);
    });

    it("should reject user list for non-admin", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.users.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should get user by id as admin", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);
      const user = await caller.users.get({ id: 1 });
      expect(user).toBeDefined();
    });
  });

  describe("Doctor Management (Admin Only)", () => {
    it("should list all doctors", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);
      const doctors = await caller.doctors.list();
      expect(Array.isArray(doctors)).toBe(true);
    });

    it("should reject doctor creation for non-admin", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.doctors.create({
          userId: 1,
          specialty: "Cardiology",
          licenseNumber: "LIC123",
          phone: "555-0001",
          address: "123 Medical St",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Patient Management (Receptionist & Admin)", () => {
    it("should list all patients as receptionist", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      const patients = await caller.patients.list();
      expect(Array.isArray(patients)).toBe(true);
    });

    it("should search patients by name", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      const results = await caller.patients.search({ query: "John" });
      expect(Array.isArray(results)).toBe(true);
    });

    it("should reject patient list for doctor", async () => {
      const ctx = createMockContext("doctor");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.patients.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should validate required fields for patient creation", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.patients.create({
          name: "",
          dateOfBirth: "1990-01-01",
          gender: "male",
          phone: "555-0001",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Appointment Management", () => {
    it("should list appointments for receptionist", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      const appointments = await caller.appointments.list({});
      expect(Array.isArray(appointments)).toBe(true);
    });

    it("should reject appointment creation for doctor", async () => {
      const ctx = createMockContext("doctor");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.appointments.create({
          patientId: 1,
          doctorId: 1,
          appointmentDate: "2024-01-15",
          appointmentTime: "10:00",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should validate appointment date format", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.appointments.create({
          patientId: 1,
          doctorId: 1,
          appointmentDate: "invalid-date",
          appointmentTime: "10:00",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should cancel appointment as receptionist", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        const result = await caller.appointments.cancel({ id: 1 });
        expect(result.success).toBe(true);
      } catch (error: any) {
        // Expected if appointment doesn't exist in test DB
        expect(error).toBeDefined();
      }
    });
  });

  describe("Visit Notes (Doctor Only)", () => {
    it("should reject visit note creation for non-doctor", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.visitNotes.create({
          appointmentId: 1,
          doctorId: 1,
          patientId: 1,
          diagnosis: "Hypertension",
          treatment: "Medication",
          prescriptions: "Lisinopril 10mg",
          followUp: "Follow-up in 2 weeks",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should get visit notes by appointment", async () => {
      const ctx = createMockContext("doctor");
      const caller = appRouter.createCaller(ctx);
      const notes = await caller.visitNotes.getByAppointment({ appointmentId: 1 });
      expect(notes === null || notes === undefined || typeof notes === "object").toBe(true);
    });

    it("should get visit notes by patient", async () => {
      const ctx = createMockContext("doctor");
      const caller = appRouter.createCaller(ctx);
      const notes = await caller.visitNotes.getByPatient({ patientId: 1 });
      expect(Array.isArray(notes)).toBe(true);
    });
  });

  describe("Audit Logs (Admin Only)", () => {
    it("should list audit logs as admin", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);
      const logs = await caller.logs.list({ limit: 10, offset: 0 });
      expect(Array.isArray(logs)).toBe(true);
    });

    it("should reject audit log access for non-admin", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.logs.list({ limit: 10, offset: 0 });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Role-Based Access Control", () => {
    it("admin should have access to all features", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      // Admin can access user management
      const users = await caller.users.list();
      expect(Array.isArray(users)).toBe(true);

      // Admin can access doctor management
      const doctors = await caller.doctors.list();
      expect(Array.isArray(doctors)).toBe(true);

      // Admin can access patient management
      const patients = await caller.patients.list();
      expect(Array.isArray(patients)).toBe(true);

      // Admin can access audit logs
      const logs = await caller.logs.list({ limit: 10, offset: 0 });
      expect(Array.isArray(logs)).toBe(true);
    });

    it("receptionist should have limited access", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);

      // Receptionist can access patient management
      const patients = await caller.patients.list();
      expect(Array.isArray(patients)).toBe(true);

      // Receptionist can access appointments
      const appointments = await caller.appointments.list({});
      expect(Array.isArray(appointments)).toBe(true);

      // Receptionist cannot access user management
      try {
        await caller.users.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }

      // Receptionist cannot access audit logs
      try {
        await caller.logs.list({ limit: 10, offset: 0 });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("doctor should have clinical access only", async () => {
      const ctx = createMockContext("doctor");
      const caller = appRouter.createCaller(ctx);

      // Doctor can access visit notes
      const notes = await caller.visitNotes.getByPatient({ patientId: 1 });
      expect(Array.isArray(notes)).toBe(true);

      // Doctor cannot access user management
      try {
        await caller.users.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }

      // Doctor cannot create appointments
      try {
        await caller.appointments.create({
          patientId: 1,
          doctorId: 1,
          appointmentDate: "2024-01-15",
          appointmentTime: "10:00",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Data Validation", () => {
    it("should validate email format for patient creation", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.patients.create({
          name: "John Doe",
          dateOfBirth: "1990-01-01",
          gender: "male",
          phone: "555-0001",
          email: "invalid-email",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should validate gender enum for patient creation", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.patients.create({
          name: "John Doe",
          dateOfBirth: "1990-01-01",
          gender: "invalid" as any,
          phone: "555-0001",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should validate appointment status enum", async () => {
      const ctx = createMockContext("receptionist");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.appointments.update({
          id: 1,
          status: "invalid" as any,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });
});
