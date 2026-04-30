-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Game_status_endReason_score_idx" ON "Game"("status", "endReason", "score");
