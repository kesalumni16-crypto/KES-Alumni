-- CreateTable
CREATE TABLE "public"."Alumni" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT,
    "yearOfJoining" INTEGER NOT NULL,
    "passingYear" INTEGER NOT NULL,
    "admissionInFirstYear" BOOLEAN NOT NULL DEFAULT true,
    "department" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OTP" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "alumniId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_email_key" ON "public"."Alumni"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_phoneNumber_key" ON "public"."Alumni"("phoneNumber");

-- AddForeignKey
ALTER TABLE "public"."OTP" ADD CONSTRAINT "OTP_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "public"."Alumni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
