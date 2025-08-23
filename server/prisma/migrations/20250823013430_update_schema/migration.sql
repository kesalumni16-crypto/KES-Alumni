-- AlterTable
ALTER TABLE "public"."Alumni" ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "currentCity" TEXT,
ADD COLUMN     "currentCompany" TEXT,
ADD COLUMN     "currentCountry" TEXT,
ADD COLUMN     "currentJobTitle" TEXT,
ADD COLUMN     "interests" TEXT,
ADD COLUMN     "lookingForMentor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mentorshipAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "workExperience" TEXT;
