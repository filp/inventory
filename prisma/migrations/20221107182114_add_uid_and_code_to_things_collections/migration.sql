/*
  Warnings:

  - You are about to drop the column `slug` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Spot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prefix]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Thing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prefix` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Thing` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Area_slug_idx";

-- DropIndex
DROP INDEX "Area_slug_key";

-- DropIndex
DROP INDEX "Collection_slug_key";

-- DropIndex
DROP INDEX "Spot_slug_idx";

-- DropIndex
DROP INDEX "Spot_slug_key";

-- AlterTable
ALTER TABLE "Area" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "slug",
ADD COLUMN     "prefix" VARCHAR(12) NOT NULL;

-- AlterTable
ALTER TABLE "Spot" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Thing" ADD COLUMN     "uid" VARCHAR(32) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_prefix_key" ON "Collection"("prefix");

-- CreateIndex
CREATE UNIQUE INDEX "Thing_uid_key" ON "Thing"("uid");
