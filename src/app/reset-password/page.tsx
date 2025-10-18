'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false); // ✅ ensure hook runs client-side
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Only run on client
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const supabase = createClient();
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    if (!access_token || !refresh_token) {
      setError('Invalid or expired reset link.');
      return;
    }

    supabase.auth
      .setSession({ access_token, refresh_token })
      .catch((err) => setError(err.message));
  }, [ready, searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) setError(error.message);
    else {
      setMessage('Password updated! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  if (!ready) return null; // prevents SSR pre-render issues

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {!error && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
