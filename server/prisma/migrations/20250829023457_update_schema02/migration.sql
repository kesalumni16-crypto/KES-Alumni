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
