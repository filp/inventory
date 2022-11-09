/*
  Warnings:

  - A unique constraint covering the columns `[thingId,labelId]` on the table `ThingLabel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ThingLabel_thingId_labelId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "ThingLabel_thingId_labelId_key" ON "ThingLabel"("thingId", "labelId");
