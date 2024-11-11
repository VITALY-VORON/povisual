/*
  Warnings:

  - You are about to drop the column `userid` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `locationid` on the `nodes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "locations_userid_idx";

-- DropIndex
DROP INDEX "nodes_locationid_idx";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "userid",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "nodes" DROP COLUMN "locationid",
ADD COLUMN     "locationId" INTEGER;

-- CreateTable
CREATE TABLE "NodeFile" (
    "id" SERIAL NOT NULL,
    "idInFile" INTEGER NOT NULL,
    "nodeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "coordinate_x" DOUBLE PRECISION NOT NULL,
    "coordinate_y" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "text_broadcast" TEXT NOT NULL,
    "is_destination" BOOLEAN NOT NULL,
    "is_phantom" BOOLEAN NOT NULL,
    "is_turns_verbose" BOOLEAN NOT NULL,
    "location" INTEGER,

    CONSTRAINT "NodeFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeaconNode" (
    "id" SERIAL NOT NULL,
    "idInFile" INTEGER NOT NULL,
    "mac" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nodeFileId" INTEGER,

    CONSTRAINT "BeaconNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BeaconNode_nodeFileId_key" ON "BeaconNode"("nodeFileId");

-- CreateIndex
CREATE INDEX "locations_userId_idx" ON "locations"("userId");

-- CreateIndex
CREATE INDEX "nodes_locationId_idx" ON "nodes"("locationId");
