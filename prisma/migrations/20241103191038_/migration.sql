/*
  Warnings:

  - You are about to drop the `BeaconNode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EdgeFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NodeFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EdgeFileToLocationFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LocationFileToNodeFile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[locationFileId]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "locationFileId" INTEGER;

-- DropTable
DROP TABLE "BeaconNode";

-- DropTable
DROP TABLE "EdgeFile";

-- DropTable
DROP TABLE "LocationFile";

-- DropTable
DROP TABLE "NodeFile";

-- DropTable
DROP TABLE "_EdgeFileToLocationFile";

-- DropTable
DROP TABLE "_LocationFileToNodeFile";

-- CreateTable
CREATE TABLE "location_files" (
    "id" SERIAL NOT NULL,
    "idInFile" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT,
    "is_old_turns" BOOLEAN NOT NULL,
    "azimut" TEXT,

    CONSTRAINT "location_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_files" (
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
    "locationId" INTEGER,

    CONSTRAINT "node_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beacon_nodes" (
    "id" SERIAL NOT NULL,
    "idInFile" INTEGER NOT NULL,
    "mac" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nodeFileId" INTEGER,

    CONSTRAINT "beacon_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edge_files" (
    "id" SERIAL NOT NULL,
    "start" INTEGER NOT NULL,
    "stop" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "locationFileId" INTEGER,

    CONSTRAINT "edge_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "node_files_locationId_idx" ON "node_files"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "beacon_nodes_nodeFileId_key" ON "beacon_nodes"("nodeFileId");

-- CreateIndex
CREATE INDEX "edge_files_locationFileId_idx" ON "edge_files"("locationFileId");

-- CreateIndex
CREATE UNIQUE INDEX "files_locationFileId_key" ON "files"("locationFileId");
