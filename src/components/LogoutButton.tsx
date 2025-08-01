'use client'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }
  return <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
}
