"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@ats.com" && password === "admin123") {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Fullscreen background image */}
      <Image
       src="/login-background.webp" // ✅ webp image path
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
          <h1 className="text-2xl font-bold text-center text-gray-900">Welcome to HRMS</h1>
          {error && <p className="text-red-600 text-sm">{error}</p>}

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
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
