import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.candidate.createMany({
    data: [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        position: "Frontend Developer",
        status: "Applied",
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        position: "Backend Developer",
        status: "Interviewed",
      },
      {
        name: "Charlie Davis",
        email: "charlie@example.com",
        position: "Full Stack Engineer",
        status: "Hired",
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding complete.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
