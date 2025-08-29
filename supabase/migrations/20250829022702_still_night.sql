/*
  # Enhanced Profile and Registration Fields

  1. New Personal Information Fields
    - `gender` (text) - Gender selection (male, female, other, prefer_not_to_say)
    - `profilePhoto` (text) - URL to profile photo
    - `whatsappNumber` (text) - WhatsApp number
    - `secondaryPhoneNumber` (text) - Second phone number

  2. Enhanced Address Fields
    - Personal Address: `personalStreet`, `personalCity`, `personalState`, `personalPincode`, `personalCountry`
    - Company Address: `companyStreet`, `companyCity`, `companyState`, `companyPincode`, `companyCountry`

  3. Enhanced Social Media Fields
    - `instagramProfile` (text) - Instagram profile URL
    - `twitterProfile` (text) - Twitter/X profile URL
    - `facebookProfile` (text) - Facebook profile URL
    - `githubProfile` (text) - GitHub profile URL
    - `personalWebsite` (text) - Personal website URL

  4. Security
    - All new fields are optional and can be updated by authenticated users
*/

-- Add personal information fields
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "gender" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "profilePhoto" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "whatsappNumber" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "secondaryPhoneNumber" TEXT;

-- Add personal address fields
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "personalStreet" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "personalCity" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "personalState" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "personalPincode" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "personalCountry" TEXT;

-- Add company address fields
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "companyStreet" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "companyCity" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "companyState" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "companyPincode" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "companyCountry" TEXT;

-- Add enhanced social media fields
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "instagramProfile" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "twitterProfile" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "facebookProfile" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "githubProfile" TEXT;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "personalWebsite" TEXT;