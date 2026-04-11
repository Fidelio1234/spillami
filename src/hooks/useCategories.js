import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async (retries = 3) => {
    setLoading(true)
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      if (!error && data) {
        setCategories(data)
        setLoading(false)
        return
      }
      // Aspetta prima di riprovare
      if (i < retries - 1) await new Promise((r) => setTimeout(r, 1000))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const mainCategories = categories.filter((c) => !c.parent_id)
  const getChildren = (parentId) => categories.filter((c) => c.parent_id === parentId)
  const hasChildren = (parentId) => categories.some((c) => c.parent_id === parentId)

  return { categories, mainCategories, getChildren, hasChildren, loading, refetch: fetchCategories }
}

export const categoryService = {
  async create(name, parentId = null) {
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: name.trim(), slug, parent_id: parentId || null }])
      .select()
      .single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  }
}
