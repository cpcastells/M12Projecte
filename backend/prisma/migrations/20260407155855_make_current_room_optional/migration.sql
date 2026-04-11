-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_currentRoomId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "currentRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_currentRoomId_fkey" FOREIGN KEY ("currentRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
