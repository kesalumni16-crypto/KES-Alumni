/*
  # Add Role System and Maintenance Mode

  1. New Tables
    - Add `role` enum with SUPERADMIN, ADMIN, ALUMNI values
    - Add `maintenanceMode` table for system maintenance control
  
  2. Schema Changes
    - Add `role` column to Alumni table with default 'ALUMNI'
    - Create maintenance mode tracking table
  
  3. Security
    - Set default role for new registrations
    - Add maintenance mode control system
*/

-- Create enum for user roles
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'ALUMNI');

-- Add role column to Alumni table
ALTER TABLE "public"."Alumni" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'ALUMNI';

-- Create maintenance mode table
CREATE TABLE IF NOT EXISTS "public"."MaintenanceMode" (
    "id" SERIAL NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "enabledBy" INTEGER,
    "enabledAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceMode_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint for enabledBy
ALTER TABLE "public"."MaintenanceMode" ADD CONSTRAINT "MaintenanceMode_enabledBy_fkey" FOREIGN KEY ("enabledBy") REFERENCES "public"."Alumni"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Insert default maintenance mode record
INSERT INTO "public"."MaintenanceMode" ("isEnabled", "message") VALUES (false, 'System is under maintenance. Please check back later.');