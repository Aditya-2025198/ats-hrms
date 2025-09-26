"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function DashboardEntry() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // Fetch profile with modules
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("modules")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        console.error("Profile fetch error:", error);
        router.push("/login");
        return;
      }

      // Handle module redirects
      if (profile.modules?.length === 1) {
        router.push(`/dashboard/${profile.modules[0]}`);
      } else if (profile.modules?.length > 1) {
        router.push("/dashboard/select-module");
      } else {
        // No modules assigned → maybe send them to a default page
        router.push("/dashboard/select-module");
      }

      setLoading(false);
    };

    getSessionAndProfile();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return null; // nothing renders, user always gets redirected
}
