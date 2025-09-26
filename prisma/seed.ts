// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Database seed started...");

  // Optionally: Insert only system-level defaults if needed
  // Example: an initial company or config
  // const company = await prisma.company.create({
  //   data: { name: "Default Company" },
  // });

  console.log("✅ No demo data inserted. Database ready.");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
