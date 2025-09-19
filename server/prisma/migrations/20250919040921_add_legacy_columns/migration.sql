/*
  Warnings:

  - Made the column `firstName` on table `Alumni` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Alumni` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."Alumni_username_idx";

-- AlterTable
ALTER TABLE "public"."Alumni" ADD COLUMN     "companyPincode" TEXT,
ADD COLUMN     "companyStreet" TEXT,
ADD COLUMN     "personalPincode" TEXT,
ADD COLUMN     "personalStreet" TEXT,
ALTER COLUMN "fullName" DROP NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Education" ALTER COLUMN "updatedAt" DROP DEFAULT;
