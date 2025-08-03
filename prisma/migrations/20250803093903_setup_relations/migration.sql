/*
  Warnings:

  - Added the required column `department` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "department" TEXT NOT NULL,
ALTER COLUMN "jobId" DROP NOT NULL;
