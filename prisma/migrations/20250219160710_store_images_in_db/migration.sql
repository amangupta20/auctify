/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Auction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Auction` DROP COLUMN `imageUrl`,
    ADD COLUMN `imageData` LONGBLOB NULL,
    ADD COLUMN `imageType` VARCHAR(191) NULL;
