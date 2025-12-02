// /app/reset-page/page.tsx
"use client";
import { useState } from "react";
// Import the client from your new utility file
import { createClient } from "@/lib/supabaseClient"; 
import { useRouter } from "next/navigation";

// Consider adding password confirmation for better UX
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // --- Added validation check ---
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    // ----------------------------
    
    // Note: createClient here is the browser client
    const supabase = createClient();

    // supabase.auth.updateUser only works if a user session is active.
    // The session should be created by a separate Route Handler (see below)
    // after the user clicks the email link.
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      // The error message for a missing session is often "Auth session missing!"
      // or similar, which is why the token exchange handler is important.
      setError(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting to login...");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
