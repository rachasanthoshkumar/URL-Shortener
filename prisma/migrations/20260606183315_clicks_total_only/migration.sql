/*
  Warnings:

  - You are about to drop the column `browser` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `referrer` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `visitorHash` on the `Click` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Click_visitorHash_idx";

-- AlterTable
ALTER TABLE "Click" DROP COLUMN "browser",
DROP COLUMN "country",
DROP COLUMN "device",
DROP COLUMN "os",
DROP COLUMN "referrer",
DROP COLUMN "userAgent",
DROP COLUMN "visitorHash";
