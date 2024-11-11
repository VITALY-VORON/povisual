-- CreateTable
CREATE TABLE "EdgeFile" (
    "id" SERIAL NOT NULL,
    "start" INTEGER NOT NULL,
    "stop" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "EdgeFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EdgeFileToLocationFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EdgeFileToLocationFile_AB_unique" ON "_EdgeFileToLocationFile"("A", "B");

-- CreateIndex
CREATE INDEX "_EdgeFileToLocationFile_B_index" ON "_EdgeFileToLocationFile"("B");
