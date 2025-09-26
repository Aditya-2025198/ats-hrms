"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const ALL_MODULES = {
  ats: { name: "ATS", description: "Applicant Tracking System" },
  hrms: { name: "HRMS", description: "Human Resource Management" },
  payroll: { name: "Payroll", description: "Payroll Management" },
  performance: { name: "Performance", description: "Performance Reviews" },
};

export default function SelectModule() {
  const supabase = createClient();
  const router = useRouter();
  const [userModules, setUserModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("modules")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        console.error("Error fetching profile:", error);
        router.push("/login");
        return;
      }

      setUserModules(profile.modules || []);
      setLoading(false);
    };

    fetchModules();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading modules...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Choose a Module</h1>
      {userModules.length === 0 ? (
        <p className="text-gray-500">No modules assigned to your account.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {userModules.map((mod) => {
            const info = ALL_MODULES[mod as keyof typeof ALL_MODULES];
            if (!info) return null; // skip unknown keys
            return (
              <Link
                key={mod}
                href={`/dashboard/${mod}`}
                className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold">{info.name}</h2>
                <p className="text-sm text-gray-500">{info.description}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
