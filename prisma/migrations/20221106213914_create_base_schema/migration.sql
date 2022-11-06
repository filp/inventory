-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spot" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thing" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "spotId" INTEGER NOT NULL,

    CONSTRAINT "Thing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#000',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThingLabel" (
    "id" SERIAL NOT NULL,
    "thingId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,

    CONSTRAINT "ThingLabel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Collection_name_idx" ON "Collection"("name");

-- CreateIndex
CREATE INDEX "Collection_archivedAt_idx" ON "Collection"("archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Area_slug_key" ON "Area"("slug");

-- CreateIndex
CREATE INDEX "Area_name_idx" ON "Area"("name");

-- CreateIndex
CREATE INDEX "Area_slug_idx" ON "Area"("slug");

-- CreateIndex
CREATE INDEX "Area_archivedAt_idx" ON "Area"("archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Spot_slug_key" ON "Spot"("slug");

-- CreateIndex
CREATE INDEX "Spot_name_idx" ON "Spot"("name");

-- CreateIndex
CREATE INDEX "Spot_slug_idx" ON "Spot"("slug");

-- CreateIndex
CREATE INDEX "Spot_areaId_idx" ON "Spot"("areaId");

-- CreateIndex
CREATE INDEX "Spot_archivedAt_idx" ON "Spot"("archivedAt");

-- CreateIndex
CREATE INDEX "Thing_name_idx" ON "Thing"("name");

-- CreateIndex
CREATE INDEX "Thing_spotId_idx" ON "Thing"("spotId");

-- CreateIndex
CREATE INDEX "Thing_archivedAt_idx" ON "Thing"("archivedAt");

-- CreateIndex
CREATE INDEX "Label_name_idx" ON "Label"("name");

-- CreateIndex
CREATE INDEX "Label_archivedAt_idx" ON "Label"("archivedAt");

-- CreateIndex
CREATE INDEX "ThingLabel_thingId_labelId_idx" ON "ThingLabel"("thingId", "labelId");

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thing" ADD CONSTRAINT "Thing_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThingLabel" ADD CONSTRAINT "ThingLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThingLabel" ADD CONSTRAINT "ThingLabel_thingId_fkey" FOREIGN KEY ("thingId") REFERENCES "Thing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
