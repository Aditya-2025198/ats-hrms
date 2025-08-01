import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Database seeded successfully (no demo data).");
  // You can add initial setup here later if needed (e.g., create a super admin)
}

main()
  .then(() => console.log("Seeding complete."))
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
