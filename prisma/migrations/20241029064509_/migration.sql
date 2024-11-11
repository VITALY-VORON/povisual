/*
  Warnings:

  - You are about to drop the column `location` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `users` table. All the data in the column will be lost.
  - Added the required column `locationid` to the `nodes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "nodes_userId_idx";

-- AlterTable
ALTER TABLE "nodes" DROP COLUMN "location",
DROP COLUMN "userId",
ADD COLUMN     "locationid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarUrl";

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "visibility" BOOLEAN NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "locations_userid_idx" ON "locations"("userid");

-- CreateIndex
CREATE INDEX "nodes_locationid_idx" ON "nodes"("locationid");
