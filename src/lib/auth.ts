// lib/auth.ts
import { supabase } from './supabaseClient'

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  await supabase.auth.signOut()
}
