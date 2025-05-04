/*
  Warnings:

  - You are about to alter the column `status` on the `Auction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Auction` MODIFY `status` ENUM('ACTIVE', 'FINISHED', 'INVOICED', 'PAID') NOT NULL DEFAULT 'ACTIVE';
