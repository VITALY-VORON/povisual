-- CreateTable
CREATE TABLE "LocationFile" (
    "id" SERIAL NOT NULL,
    "idInFile" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT,
    "is_old_turns" BOOLEAN NOT NULL,
    "azimut" TEXT,

    CONSTRAINT "LocationFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LocationFileToNodeFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocationFileToNodeFile_AB_unique" ON "_LocationFileToNodeFile"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationFileToNodeFile_B_index" ON "_LocationFileToNodeFile"("B");
