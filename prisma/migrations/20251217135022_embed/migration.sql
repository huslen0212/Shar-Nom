/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `place` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "place" ADD COLUMN     "embedding" JSONB,
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "place_slug_key" ON "place"("slug");
