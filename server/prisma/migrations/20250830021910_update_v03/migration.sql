-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'ALUMNI');

-- AlterTable
ALTER TABLE "public"."Alumni" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'ALUMNI';

-- CreateTable
CREATE TABLE "public"."MaintenanceMode" (
    "id" SERIAL NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "enabledBy" INTEGER,
    "enabledAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceMode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MaintenanceMode" ADD CONSTRAINT "MaintenanceMode_enabledBy_fkey" FOREIGN KEY ("enabledBy") REFERENCES "public"."Alumni"("id") ON DELETE SET NULL ON UPDATE CASCADE;
