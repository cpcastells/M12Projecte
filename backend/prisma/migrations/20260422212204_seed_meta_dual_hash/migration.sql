-- Buidem SeedMeta: la propera execució del seed la repoblarà amb els dos hashes.
TRUNCATE TABLE "SeedMeta";

-- AlterTable
ALTER TABLE "SeedMeta" ADD COLUMN "structuralHash" TEXT NOT NULL;
