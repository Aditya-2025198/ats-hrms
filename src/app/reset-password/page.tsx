// /app/reset-page/page.tsx
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

// Initialize client outside the component for stability (assuming it uses createBrowserClient)
const supabase = createClient();

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("Enter your new password.");
  const [error, setError] = useState("");
  const [isSessionReady, setIsSessionReady] = useState(false); // New state to control form submission
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code"); // Get the 'code' from the URL

  // --- Step 1: Exchange the Code for a Session ---
  useEffect(() => {
    // Only attempt the exchange if a code is present and the session is not yet ready
    if (code && !isSessionReady) {
      setError("");
      setMessage("Processing reset link...");
      
      // Exchange the code for a temporary authenticated session
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setError(
            `Link processing error: ${error.message}. Please try again from the email link.`
          );
          setIsSessionReady(false);
        } else {
          // Success! The temporary session is now established in the browser's storage.
          setMessage(
            "Security token verified. Enter and confirm your new password."
          );
          setIsSessionReady(true);
          // Optional: Clear the URL parameter to clean up the browser history
          router.replace('/reset-page', { shallow: true });
        }
      });
    } else if (!code && !isSessionReady) {
      // Handle the case where the user navigates here directly without a code
      setError("Invalid access. Please use the link sent to your email.");
    }
  }, [code, isSessionReady, router]);


  // --- Step 2: Update the Password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isSessionReady) {
      setError("Please wait for the security token to be processed or use the link from your email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    // This call will now succeed because the user is temporarily logged in 
    // due to the successful exchangeCodeForSession() in the useEffect hook.
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
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
        
        {/* Display Error/Message from both the exchange and the update steps */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && !error && <p className="text-blue-600 text-sm mb-4">{message}</p>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!isSessionReady} // Disable form until session is ready
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!isSessionReady} // Disable form until session is ready
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
            disabled={!isSessionReady} // Disable button until session is ready
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
