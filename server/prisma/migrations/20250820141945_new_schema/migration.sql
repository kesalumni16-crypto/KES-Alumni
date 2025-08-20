-- DropForeignKey
ALTER TABLE "public"."OTP" DROP CONSTRAINT "OTP_alumniId_fkey";

-- AlterTable
ALTER TABLE "public"."Alumni" ADD COLUMN     "address" TEXT,
ADD COLUMN     "currentName" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "enrollmentToYear" INTEGER,
ADD COLUMN     "linkedinProfile" TEXT,
ADD COLUMN     "socialMediaWebsite" TEXT;

-- AddForeignKey
ALTER TABLE "public"."OTP" ADD CONSTRAINT "OTP_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "public"."Alumni"("id") ON DELETE CASCADE ON UPDATE CASCADE;
