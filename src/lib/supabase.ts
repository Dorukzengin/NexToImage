import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
  console.error('Please check your .env file and ensure these variables are set correctly.')
}

// Create a mock client if environment variables are missing
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type AuthUser = {
  id: string
  email: string
  name: string
  avatar_url?: string
  provider?: string
}

export const authService = {
  async signUp(email: string, password: string, name: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    
    return { data, error }
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signInWithGoogle() {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  async signOut() {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    if (!supabase) {
      return null
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange(callback: (user: any) => void) {
    if (!supabase) {
      // Return a mock subscription that does nothing
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}