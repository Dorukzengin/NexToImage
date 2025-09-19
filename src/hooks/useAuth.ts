import { useState, useEffect } from 'react'
import { authService, AuthUser } from '../lib/supabase'
import { supabase } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        await loadUserProfile(currentUser.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      if (user) {
        await loadUserProfile(user.id)
      } else {
        setUser(null)
        setCredits(0)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
      })
      setCredits(profile.credits)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    const { data, error } = await authService.signUp(email, password, name)
    setLoading(false)
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { data, error } = await authService.signIn(email, password)
    setLoading(false)
    return { data, error }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    const { data, error } = await authService.signInWithGoogle()
    setLoading(false)
    return { data, error }
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await authService.signOut()
    setUser(null)
    setCredits(0)
    setLoading(false)
    return { error }
  }

  const updateCredits = async (creditChange: number) => {
    if (!user) return

    try {
      const { data, error } = await supabase.rpc('update_user_credits', {
        user_id: user.id,
        credit_change: creditChange
      })

      if (error) throw error

      setCredits(data)
      return data
    } catch (error) {
      console.error('Error updating credits:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    credits,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateCredits
  }
}