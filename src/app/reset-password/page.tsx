"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setError("Invalid reset link or token is missing.");
        return;
      }

      const supabase = createClient();

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setError("Link expired or invalid. Request a new reset email.");
      }
    };

    exchangeCode();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

