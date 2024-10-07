-- CreateTable
CREATE TABLE "nodes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "coordinate_x" INTEGER NOT NULL,
    "coordinate_y" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "text_broadcast" TEXT NOT NULL,
    "is_destination" BOOLEAN NOT NULL,
    "is_phantom" BOOLEAN NOT NULL,
    "is_turns_verbose" BOOLEAN NOT NULL,
    "location" INTEGER,
    "userId" TEXT,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "nodes_userId_idx" ON "nodes"("userId");
