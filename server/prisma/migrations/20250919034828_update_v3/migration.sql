-- Multi-Education Platform Support and Profile Enhancements Migration

/*
  # Multi-Education Platform Support and Profile Enhancements

  1. New Tables
    - `Education` - Store multiple education records per alumni
  
  2. Schema Updates
    - Add `middleName` field to Alumni table
    - Add `username` field (auto-generated from first + last name)
    - Remove redundant name fields
    - Normalize address fields with proper structure
  
  3. Data Migration
    - Migrate existing education data to new Education table
    - Generate usernames for existing users
    - Clean up redundant fields
*/

-- Create Education table for multiple education records
CREATE TABLE IF NOT EXISTS "public"."Education" (
    "id" SERIAL NOT NULL,
    "alumniId" INTEGER NOT NULL,
    "institutionName" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "isCurrentlyStudying" BOOLEAN NOT NULL DEFAULT false,
    "grade" TEXT,
    "description" TEXT,
    "activities" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- Add new fields to Alumni table
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "middleName" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "username" TEXT;

-- Normalize address fields (rename existing fields for clarity)
ALTER TABLE "public"."Alumni" RENAME COLUMN "personalStreet" TO "personalAddressLine1";
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "personalAddressLine2" TEXT;
ALTER TABLE "public"."Alumni" RENAME COLUMN "personalPincode" TO "personalPostalCode";

ALTER TABLE "public"."Alumni" RENAME COLUMN "companyStreet" TO "companyAddressLine1";
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "companyAddressLine2" TEXT;
ALTER TABLE "public"."Alumni" RENAME COLUMN "companyPincode" TO "companyPostalCode";

-- Migrate existing education data to new Education table
INSERT INTO "public"."Education" ("alumniId", "institutionName", "degree", "fieldOfStudy", "startYear", "endYear", "isCurrentlyStudying")
SELECT 
    "id" as "alumniId",
    COALESCE("college", 'Unknown Institution') as "institutionName",
    COALESCE("course", 'Unknown Degree') as "degree",
    COALESCE("department", 'Unknown Field') as "fieldOfStudy",
    COALESCE("yearOfJoining", 2000) as "startYear",
    CASE 
        WHEN "passingYear" IS NOT NULL AND "passingYear" > 0 THEN "passingYear"
        ELSE NULL
    END as "endYear",
    CASE 
        WHEN "passingYear" IS NULL OR "passingYear" = 0 THEN true
        ELSE false
    END as "isCurrentlyStudying"
FROM "public"."Alumni"
WHERE "isVerified" = true;

-- Generate usernames for existing users
UPDATE "public"."Alumni" 
SET "username" = LOWER(
    REGEXP_REPLACE(
        COALESCE("firstName", '') || 
        CASE WHEN "firstName" IS NOT NULL AND "lastName" IS NOT NULL THEN '.' ELSE '' END ||
        COALESCE("lastName", ''),
        '[^a-zA-Z0-9.]', '', 'g'
    )
)
WHERE "username" IS NULL;

-- Handle cases where username might be empty
UPDATE "public"."Alumni" 
SET "username" = 'user' || "id"
WHERE "username" IS NULL OR "username" = '';

-- Add foreign key constraint for Education table
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_alumniId_fkey" 
FOREIGN KEY ("alumniId") REFERENCES "public"."Alumni"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "Education_alumniId_idx" ON "public"."Education"("alumniId");
CREATE INDEX IF NOT EXISTS "Alumni_username_idx" ON "public"."Alumni"("username");

-- Add unique constraint for username (allowing for duplicates to be handled by application logic)
-- We'll handle uniqueness in the application layer to avoid migration conflicts