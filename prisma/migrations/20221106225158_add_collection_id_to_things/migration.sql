/*
  Warnings:

  - Added the required column `collectionId` to the `Thing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Thing" ADD COLUMN     "collectionId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Thing_collectionId_idx" ON "Thing"("collectionId");

-- AddForeignKey
ALTER TABLE "Thing" ADD CONSTRAINT "Thing_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
