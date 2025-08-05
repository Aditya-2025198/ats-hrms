// lib/auth.ts
import { supabase } from './supabaseClient'
import { User, Session } from '@supabase/supabase-js'

// Get currently logged-in user
export const getUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

// Sign up a new user
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// Sign in an existing user
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Sign out user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
