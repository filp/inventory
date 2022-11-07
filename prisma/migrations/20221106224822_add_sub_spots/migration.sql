-- AlterTable
ALTER TABLE "Spot" ADD COLUMN     "parentSpotId" INTEGER;

-- CreateIndex
CREATE INDEX "Spot_parentSpotId_idx" ON "Spot"("parentSpotId");

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_parentSpotId_fkey" FOREIGN KEY ("parentSpotId") REFERENCES "Spot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
