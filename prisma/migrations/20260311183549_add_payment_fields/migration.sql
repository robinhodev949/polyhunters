/*
  Warnings:

  - Added the required column `totalAmount` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "ownerWallet" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "depositTxSig" TEXT,
ADD COLUMN     "ownerAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "payoutStatus" TEXT NOT NULL DEFAULT 'unpaid',
ADD COLUMN     "payoutTxSig" TEXT,
ADD COLUMN     "platformFee" DOUBLE PRECISION,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
