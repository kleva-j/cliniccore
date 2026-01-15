CREATE TYPE "public"."status" AS ENUM('scheduled', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'receptionist', 'doctor', 'patient');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patientId" integer NOT NULL,
	"doctorId" integer NOT NULL,
	"appointmentDate" date NOT NULL,
	"appointmentTime" varchar(5) NOT NULL,
	"status" "status" DEFAULT 'scheduled' NOT NULL,
	"reason" text,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"specialty" varchar(255) NOT NULL,
	"licenseNumber" varchar(255),
	"phone" varchar(20),
	"address" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"action" varchar(255) NOT NULL,
	"entityType" varchar(100),
	"entityId" integer,
	"details" text,
	"ipAddress" varchar(45),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"patientId" integer NOT NULL,
	"userId" integer NOT NULL,
	"email" varchar(320) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patient_accounts_patientId_unique" UNIQUE("patientId"),
	CONSTRAINT "patient_accounts_userId_unique" UNIQUE("userId"),
	CONSTRAINT "patient_accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"dateOfBirth" date NOT NULL,
	"gender" "gender" NOT NULL,
	"phone" varchar(20) NOT NULL,
	"address" text,
	"email" varchar(320),
	"emergencyContactName" varchar(255),
	"emergencyContactPhone" varchar(20),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'patient' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "visit_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointmentId" integer NOT NULL,
	"doctorId" integer NOT NULL,
	"patientId" integer NOT NULL,
	"diagnosis" text,
	"treatment" text,
	"prescriptions" text,
	"followUp" text,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
