import { useState, useEffect } from 'react'
import { authService, AuthUser } from '../lib/supabase'
import { supabase } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [videoCredits, setVideoCredits] = useState(0)
  const [imagePlan, setImagePlan] = useState('free')
  const [videoPlan, setVideoPlan] = useState('free')

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
      // Wait a bit for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      // If profile doesn't exist, create it manually
      if (error && error.code === 'PGRST116') {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          console.log('Creating user profile manually for:', user.id)
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              avatar_url: user.user_metadata?.avatar_url
            })
            .select()
            .single()

          if (insertError) {
            console.error('Error creating user profile:', insertError)
            
            // If duplicate key error, retry fetching the existing profile
            if (insertError.code === '23505') {
              console.log('Profile already exists, retrying fetch...')
              const { data: existingProfile, error: retryError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single()
              
              if (!retryError && existingProfile) {
                profile = existingProfile
              } else {
                // Fallback profile if retry also fails
                profile = {
                  id: user.id,
                  email: user.email || '',
                  name: user.user_metadata?.name || user.user_metadata?.full_name || 'User',
                  avatar_url: user.user_metadata?.avatar_url,
                  credits: 2,
                  video_credits: 0
                }
              }
            } else {
              // Other insert errors - use fallback profile
              profile = {
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.name || user.user_metadata?.full_name || 'User',
                avatar_url: user.user_metadata?.avatar_url,
                credits: 2,
                video_credits: 0
              }
            }
          } else {
            profile = newProfile
          }
        }
      } else if (error) {
        console.error('Error loading user profile:', error)
        return
      }

      if (!profile) return

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
      })
      setCredits(profile.credits)
      setVideoCredits(profile.video_credits || 0)
      setImagePlan(profile.image_plan || 'free')
      setVideoPlan(profile.video_plan || 'free')
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
    setVideoCredits(0)
    setImagePlan('free')
    setVideoPlan('free')
    setLoading(false)
    return { error }
  }

  const updatePlan = async (planType: 'image' | 'video', planId: string) => {
    if (!user) return

    try {
      const updateData: any = {};
      
      if (planType === 'image') {
        updateData.image_plan = planId;
      } else {
        updateData.video_plan = planId;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      if (planType === 'image') {
        setImagePlan(planId);
      } else {
        setVideoPlan(planId);
      }

      // Also add credits based on the plan
      const planCredits = getPlanCredits(planType, planId);
      if (planCredits > 0) {
        if (planType === 'image') {
          await updateCredits(credits + planCredits);
        } else {
          await updateVideoCredits(videoCredits + planCredits);
        }
      }

      return data;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  const getPlanCredits = (planType: 'image' | 'video', planId: string): number => {
    if (planType === 'image') {
      switch (planId) {
        case 'starter': return 50;
        case 'pro': return 100;
        case 'premium': return 150;
        default: return 0;
      }
    } else {
      switch (planId) {
        case 'video-starter': return 5;
        default: return 0;
      }
    }
  }

  const updateCredits = async (newCredits: number) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ credits: newCredits })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setCredits(newCredits);
      return newCredits;
    } catch (error) {
      console.error('Error updating credits:', error);
      throw error;
    }
  }

  const updateVideoCredits = async (newVideoCredits: number) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ video_credits: newVideoCredits })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setVideoCredits(newVideoCredits);
      return newVideoCredits;
    } catch (error) {
      console.error('Error updating video credits:', error);
      throw error;
    }
  }

  const oldUpdatePlan = async (planType: 'image' | 'video', planId: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase.rpc('update_user_plan', {
        user_id: user.id,
        plan_type: planType,
        plan_id: planId
      })

      if (error) throw error

      if (planType === 'image') {
        setImagePlan(planId)
      } else {
        setVideoPlan(planId)
      }

      return data
    } catch (error) {
      console.error('Error updating plan:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    credits,
    videoCredits,
    imagePlan,
    videoPlan,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updatePlan
  }
}