import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,

  init: async () => {
    let initDone = false

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return
      if (!initDone) return
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return
      if (event === 'SIGNED_IN') return 
      if (session?.user) {
        await get().fetchProfile(session.user)
      } else {
        set({ user: null, profile: null, isAdmin: false, loading: false })
      }
    })

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await get().fetchProfile(session.user)
    } else {
      set({ loading: false })
    }

    initDone = true
  },

  fetchProfile: async (user) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    set({
      user,
      profile: data || null,
      isAdmin: data?.role === 'admin',
      loading: false,
    })
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, isAdmin: false })
  },
}))