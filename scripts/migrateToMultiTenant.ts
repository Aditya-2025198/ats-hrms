// scripts/migrateToMultiTenant.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create a default company
  const company = await prisma.company.create({
    data: { name: 'Default Company' }
  })

  // Assign companyId to existing records
  await prisma.job.updateMany({ data: { companyId: company.id } })
  await prisma.candidate.updateMany({ data: { companyId: company.id } })
  await prisma.employee.updateMany({ data: { companyId: company.id } })

  console.log("Migration completed. All records now linked to:", company.name)
}

main().finally(() => prisma.$disconnect())
