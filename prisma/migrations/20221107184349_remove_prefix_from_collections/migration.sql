/*
  Warnings:

  - You are about to drop the column `prefix` on the `Collection` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Collection_prefix_key";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "prefix";
