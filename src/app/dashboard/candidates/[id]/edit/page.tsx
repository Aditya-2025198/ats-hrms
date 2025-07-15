import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";

const prisma = new PrismaClient();

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditCandidatePage({ params }: PageProps) {
  const candidate = await prisma.candidate.findUnique({
    where: { id: Number(params.id) },
  });

  if (!candidate) return notFound();

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Candidate</h1>

      <form method="POST" action={`/api/candidates/${candidate.id}`}>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            name="name"
            defaultValue={candidate.name}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            name="email"
            defaultValue={candidate.email}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Status</label>
          <select
            name="status"
            defaultValue={candidate.status}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="applied">Applied</option>
            <option value="interviewed">Interviewed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
        <Link href="/dashboard/candidates" className="ml-4 text-sm text-gray-600">
          Cancel
        </Link>
      </form>
    </div>
  );
}
