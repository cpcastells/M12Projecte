-- DropIndex
DROP INDEX "Game_userId_key";

-- CreateIndex
CREATE INDEX "Game_userId_status_idx" ON "Game"("userId", "status");
