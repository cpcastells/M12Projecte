/*
  Warnings:

  - The values [abandoned] on the enum `GameStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "GameEndReason" AS ENUM ('success', 'timeExpired', 'attemptsExceeded', 'abandoned');

-- AlterEnum
BEGIN;
CREATE TYPE "GameStatus_new" AS ENUM ('active', 'completed', 'ended');
ALTER TABLE "public"."Game" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "status" TYPE "GameStatus_new" USING ("status"::text::"GameStatus_new");
ALTER TYPE "GameStatus" RENAME TO "GameStatus_old";
ALTER TYPE "GameStatus_new" RENAME TO "GameStatus";
DROP TYPE "public"."GameStatus_old";
ALTER TABLE "Game" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "endReason" "GameEndReason";

-- CreateIndex
CREATE INDEX "Game_status_endReason_idx" ON "Game"("status", "endReason");
