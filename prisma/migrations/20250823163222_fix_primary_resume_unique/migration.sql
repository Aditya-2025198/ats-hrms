/*
  Warnings:

  - You are about to drop the column `department` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `aadhaar` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `altContact` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfJoining` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `employeeCode` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `fatherName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `modeOfSeparation` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `pan` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `personalEmail` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `uan` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `initiatedBy` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `jdUrl` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `supportingDocUrl` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ActivityLog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[primaryResumeId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `Candidate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `code` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doj` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'RECRUITER', 'MANAGER');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('APPLIED', 'INTERVIEWED', 'HIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SERVING_NOTICE');

-- CreateEnum
CREATE TYPE "AttachmentKind" AS ENUM ('RESUME', 'OFFER_LETTER', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('SUPABASE', 'AWS', 'LOCAL');

-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropIndex
DROP INDEX "Employee_employeeCode_key";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "department",
DROP COLUMN "position",
DROP COLUMN "resumeUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "primaryResumeId" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "CandidateStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "updatedAt",
ADD COLUMN     "domain" TEXT;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "aadhaar",
DROP COLUMN "address",
DROP COLUMN "altContact",
DROP COLUMN "dateOfJoining",
DROP COLUMN "education",
DROP COLUMN "employeeCode",
DROP COLUMN "fatherName",
DROP COLUMN "grade",
DROP COLUMN "modeOfSeparation",
DROP COLUMN "pan",
DROP COLUMN "personalEmail",
DROP COLUMN "uan",
DROP COLUMN "updatedAt",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "doj" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "reportingTo" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EmployeeStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "initiatedBy",
DROP COLUMN "jdUrl",
DROP COLUMN "supportingDocUrl",
DROP COLUMN "updatedAt",
ALTER COLUMN "vacancy" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt",
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropTable
DROP TABLE "ActivityLog";

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "kind" "AttachmentKind" NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "provider" "StorageProvider" NOT NULL,
    "bucket" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "candidateId" TEXT,
    "employeeId" TEXT,
    "uploaderUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_primaryResumeId_key" ON "Candidate"("primaryResumeId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_code_key" ON "Employee"("code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_primaryResumeId_fkey" FOREIGN KEY ("primaryResumeId") REFERENCES "Attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploaderUserId_fkey" FOREIGN KEY ("uploaderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
