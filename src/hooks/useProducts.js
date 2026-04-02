import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

// Timestamp globale — si aggiorna quando admin salva un prodotto
export let shopInvalidate = 0
export const invalidateShop = () => { shopInvalidate = Date.now() }

export function useProducts({ category, search, sortBy, limit } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasData = useRef(false)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      if (!hasData.current) setLoading(true)
      setError(null)
      try {
        let query = supabase.from('products').select('*').eq('active', true)
        if (category && category !== 'tutti') query = query.eq('category', category)
        if (search?.trim()) query = query.ilike('name', `%${search.trim()}%`)
        if (sortBy === 'price-asc') query = query.order('price', { ascending: true })
        else if (sortBy === 'price-desc') query = query.order('price', { ascending: false })
        else if (sortBy === 'name') query = query.order('name', { ascending: true })
        else query = query.order('created_at', { ascending: false })
        if (limit) query = query.limit(limit)
        const { data, error } = await query
        if (!cancelled) {
          if (error) throw error
          setProducts(data || [])
          hasData.current = true
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [category, search, sortBy, limit, shopInvalidate])

  return { products, loading, error }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const fetch = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
        if (!cancelled) {
          if (error) throw error
          setProduct(data)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}

export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) { setError(error.message); return }
    setProducts(data || [])
  }

  useEffect(() => { fetchAll() }, [])

  return { products, loading, error, refetch: fetchAll }
}

export const productService = {
  async create(data) {
    const { data: product, error } = await supabase.from('products').insert([data]).select().single()
    if (error) throw error
    invalidateShop()
    return product
  },
  async update(id, data) {
    const { data: product, error } = await supabase.from('products').update(data).eq('id', id).select().single()
    if (error) throw error
    invalidateShop()
    return product
  },
  async delete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    invalidateShop()
  },
  async uploadImage(file, productId) {
    const ext = file.name.split('.').pop()
    const path = `${productId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  },
  async deleteImage(url) {
    const path = url.split('/product-images/')[1]
    if (!path) return
    await supabase.storage.from('product-images').remove([path])
  },
}
