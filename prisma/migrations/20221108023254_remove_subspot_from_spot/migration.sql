/*
  Warnings:

  - You are about to drop the column `parentSpotId` on the `Spot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Spot" DROP CONSTRAINT "Spot_parentSpotId_fkey";

-- DropIndex
DROP INDEX "Spot_parentSpotId_idx";

-- AlterTable
ALTER TABLE "Spot" DROP COLUMN "parentSpotId";
