/*
  # Add Role-based System and Maintenance Mode

  1. New Tables
    - `Role` - Defines user roles (SUPERADMIN, ADMIN, ALUMNI)
    - `MaintenanceMode` - Controls site maintenance status
  
  2. Schema Updates
    - Add `roleId` to Alumni table
    - Add foreign key relationship between Alumni and Role
  
  3. Default Data
    - Insert default roles
    - Set all existing users to ALUMNI role
    - Initialize maintenance mode as disabled
  
  4. Security
    - Maintain existing RLS policies
    - Add role-based access control foundation
*/

-- Create Role table
CREATE TABLE IF NOT EXISTS "Role" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- Create MaintenanceMode table
CREATE TABLE IF NOT EXISTS "MaintenanceMode" (
  "id" SERIAL NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT false,
  "message" TEXT DEFAULT 'We are currently performing maintenance. Please check back soon.',
  "enabledBy" INTEGER,
  "enabledAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MaintenanceMode_pkey" PRIMARY KEY ("id")
);

-- Add roleId column to Alumni table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Alumni' AND column_name = 'roleId'
  ) THEN
    ALTER TABLE "Alumni" ADD COLUMN "roleId" INTEGER;
  END IF;
END $$;

-- Insert default roles
INSERT INTO "Role" ("name", "description") VALUES
  ('SUPERADMIN', 'Full system access with all administrative privileges'),
  ('ADMIN', 'Administrative access with user management capabilities'),
  ('ALUMNI', 'Standard alumni access with profile management')
ON CONFLICT ("name") DO NOTHING;

-- Set default role for existing alumni (ALUMNI role)
UPDATE "Alumni" 
SET "roleId" = (SELECT "id" FROM "Role" WHERE "name" = 'ALUMNI')
WHERE "roleId" IS NULL;

-- Make roleId NOT NULL and add foreign key constraint
ALTER TABLE "Alumni" ALTER COLUMN "roleId" SET NOT NULL;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Alumni_roleId_fkey'
  ) THEN
    ALTER TABLE "Alumni" ADD CONSTRAINT "Alumni_roleId_fkey" 
    FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- Insert initial maintenance mode record
INSERT INTO "MaintenanceMode" ("isEnabled", "message") VALUES
  (false, 'We are currently performing maintenance. Please check back soon.')
ON CONFLICT DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "Alumni_roleId_idx" ON "Alumni"("roleId");
CREATE INDEX IF NOT EXISTS "Alumni_isVerified_idx" ON "Alumni"("isVerified");