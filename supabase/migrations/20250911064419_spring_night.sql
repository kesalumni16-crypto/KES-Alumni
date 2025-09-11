-- Add NewsArticle table for dynamic news feed
CREATE TABLE "public"."NewsArticle" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- Add location fields to Alumni table for Alumni Globe
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;
ALTER TABLE "public"."Alumni" ADD COLUMN IF NOT EXISTS "locationVisibility" TEXT DEFAULT 'public';

-- Add foreign key constraint for NewsArticle author
ALTER TABLE "public"."NewsArticle" ADD CONSTRAINT "NewsArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Alumni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX "NewsArticle_category_idx" ON "public"."NewsArticle"("category");
CREATE INDEX "NewsArticle_publishedAt_idx" ON "public"."NewsArticle"("publishedAt");
CREATE INDEX "NewsArticle_isPublished_idx" ON "public"."NewsArticle"("isPublished");
CREATE INDEX "Alumni_location_idx" ON "public"."Alumni"("latitude", "longitude");