/*
  Warnings:

  - Changed the type of `kind` on the `Attachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `provider` on the `Attachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `phone` on table `Candidate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `initiatedBy` on table `Candidate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jobId` on table `Candidate` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `Candidate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Made the column `domain` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reportingTo` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `description` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vacancy` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_uploaderUserId_fkey";

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_primaryResumeId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropIndex
DROP INDEX "Candidate_email_key";

-- DropIndex
DROP INDEX "Candidate_primaryResumeId_key";

-- DropIndex
DROP INDEX "Employee_code_key";

-- DropIndex
DROP INDEX "Job_code_key";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "kind",
ADD COLUMN     "kind" TEXT NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "initiatedBy" SET NOT NULL,
ALTER COLUMN "jobId" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "domain" SET NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "aadhar" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "altContactNo" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "highestEdu" TEXT,
ADD COLUMN     "modeOfSeparation" TEXT,
ADD COLUMN     "pan" TEXT,
ADD COLUMN     "personalEmail" TEXT,
ADD COLUMN     "uan" TEXT,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "reportingTo" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "vacancy" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AttachmentKind";

-- DropEnum
DROP TYPE "CandidateStatus";

-- DropEnum
DROP TYPE "EmployeeStatus";

-- DropEnum
DROP TYPE "StorageProvider";

-- DropEnum
DROP TYPE "UserRole";
