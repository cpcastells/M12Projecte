-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "aiEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "idlePhrases" TEXT[] DEFAULT ARRAY[]::TEXT[];
