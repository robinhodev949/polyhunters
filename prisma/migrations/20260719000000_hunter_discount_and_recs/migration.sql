-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hunterDiscountStartedAt" TIMESTAMP(3),
ADD COLUMN     "interestTags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "abTestSplitPercent" INTEGER,
ADD COLUMN     "pricePerDayVariantB" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "discountTier" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "originalAmount" DOUBLE PRECISION,
ALTER COLUMN "rentalCode" DROP NOT NULL,
ALTER COLUMN "rentalCode" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "username" TEXT,
    "avatarUrl" TEXT,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "isQA" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
