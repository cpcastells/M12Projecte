-- CreateTable
CREATE TABLE "SeedMeta" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "contentHash" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeedMeta_pkey" PRIMARY KEY ("id")
);
