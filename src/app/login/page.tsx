"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Step 1: Authenticate user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Login failed");
      setLoading(false);
      return;
    }

    // Step 2: Fetch company_id from hr_users table
    const { data: hrData, error: hrError } = await supabase
      .from("hr_users")
      .select("company_id")
      .eq("email", email)
      .single();

    if (hrError || !hrData) {
      setError("Unable to fetch company details");
      setLoading(false);
      return;
    }

    // Step 3: Store company_id for later use
    localStorage.setItem("company_id", hrData.company_id);

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Fullscreen background image */}
      <Image
        src="/login-background.webp"
        alt="Login Background"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Overlay with form */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
        <form
          onSubmit={handleLogin}
          className="bg-white bg-opacity-90 p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
        >
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Welcome to HRMS
          </h1>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
