/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "order" INTEGER;

-- CreateTable
CREATE TABLE "Hint" (
    "id" SERIAL NOT NULL,
    "puzzleId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Hint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hint_puzzleId_idx" ON "Hint"("puzzleId");

-- CreateIndex
CREATE UNIQUE INDEX "Hint_puzzleId_order_key" ON "Hint"("puzzleId", "order");

-- CreateIndex
CREATE INDEX "Room_order_idx" ON "Room"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Room_order_key" ON "Room"("order");

-- AddForeignKey
ALTER TABLE "Hint" ADD CONSTRAINT "Hint_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
