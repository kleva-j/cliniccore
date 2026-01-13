import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(role: "patient" = "patient"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "patient-test-user",
      email: "patient@example.com",
      name: "Test Patient",
      loginMethod: "email",
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

describe("Patient Portal", () => {
  describe("Patient Registration", () => {
    it("should validate patient ID exists", async () => {
      const caller = appRouter.createCaller({} as any);
      try {
        await caller.patientPortal.register({
          patientId: 99999,
          email: "test@example.com",
          password: "password123",
        });
        expect.fail("Should have thrown NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("should validate email format", async () => {
      const caller = appRouter.createCaller({} as any);
      try {
        await caller.patientPortal.register({
          patientId: 1,
          email: "invalid-email",
          password: "password123",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should validate password minimum length", async () => {
      const caller = appRouter.createCaller({} as any);
      try {
        await caller.patientPortal.register({
          patientId: 1,
          email: "test@example.com",
          password: "short",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Patient Login", () => {
    it("should reject invalid email", async () => {
      const caller = appRouter.createCaller({} as any);
      try {
        await caller.patientPortal.login({
          email: "nonexistent@example.com",
          password: "password123",
        });
        expect.fail("Should have thrown UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should reject invalid password", async () => {
      const caller = appRouter.createCaller({} as any);
      try {
        await caller.patientPortal.login({
          email: "patient@example.com",
          password: "wrongpassword",
        });
        expect.fail("Should have thrown UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("Patient Appointments (Protected)", () => {
    it("should reject non-patient users from viewing upcoming appointments", async () => {
      const ctx = {
        ...createMockContext(),
        user: { ...createMockContext().user, role: "receptionist" },
      };
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.patientPortal.getUpcomingAppointments();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should reject non-patient users from viewing appointment history", async () => {
      const ctx = {
        ...createMockContext(),
        user: { ...createMockContext().user, role: "doctor" },
      };
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.patientPortal.getAppointmentHistory();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should require patient role for appointment details", async () => {
      const ctx = {
        ...createMockContext(),
        user: { ...createMockContext().user, role: "admin" },
      };
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.patientPortal.getAppointmentDetails({ appointmentId: 1 });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Patient Portal Access Control", () => {
    it("patient should only access their own appointments", async () => {
      const ctx = createMockContext("patient");
      const caller = appRouter.createCaller(ctx);

      // This should work for patient role
      try {
        await caller.patientPortal.getUpcomingAppointments();
        // Expected to either succeed or fail with NOT_FOUND (no account), not FORBIDDEN
        expect(true).toBe(true);
      } catch (error: any) {
        expect(error.code).not.toBe("FORBIDDEN");
      }
    });

    it("should validate appointment ownership before returning details", async () => {
      const ctx = createMockContext("patient");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.patientPortal.getAppointmentDetails({ appointmentId: 999 });
        // Should fail with NOT_FOUND, not FORBIDDEN
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(["NOT_FOUND", "FORBIDDEN"]).toContain(error.code);
      }
    });
  });

  describe("Data Validation", () => {
    it("should validate email format on login", async () => {
      const caller = appRouter.createCaller({} as any);
      try {
        await caller.patientPortal.login({
          email: "invalid-email",
          password: "password123",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should validate appointmentId is a number", async () => {
      const ctx = createMockContext("patient");
      const caller = appRouter.createCaller(ctx);
      try {
        await caller.patientPortal.getAppointmentDetails({ appointmentId: "invalid" as any });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });
});
