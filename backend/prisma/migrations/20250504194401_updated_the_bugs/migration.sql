/*
  Warnings:

  - You are about to drop the column `strdErr` on the `testCaseResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "testCaseResult" DROP COLUMN "strdErr",
ADD COLUMN     "stdErr" TEXT;
