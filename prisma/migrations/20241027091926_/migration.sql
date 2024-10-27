/*
  Warnings:

  - You are about to drop the column `coordinate_x` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the column `coordinate_y` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the column `is_destination` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the column `is_phantom` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the column `is_turns_verbose` on the `nodes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nodes" DROP COLUMN "coordinate_x",
DROP COLUMN "coordinate_y",
DROP COLUMN "is_destination",
DROP COLUMN "is_phantom",
DROP COLUMN "is_turns_verbose";
