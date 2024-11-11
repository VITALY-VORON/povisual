/*
  Warnings:

  - You are about to drop the column `locationFileId` on the `edge_files` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "edge_files_locationFileId_idx";

-- AlterTable
ALTER TABLE "edge_files" DROP COLUMN "locationFileId",
ADD COLUMN     "locationId" INTEGER;

-- CreateIndex
CREATE INDEX "edge_files_locationId_idx" ON "edge_files"("locationId");
