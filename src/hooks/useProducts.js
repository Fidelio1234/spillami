import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const invalidateShop = () => {
  window.dispatchEvent(new CustomEvent('shop-invalidate'))
}

export function useProducts({ category, search, sortBy, limit } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [invalidateKey, setInvalidateKey] = useState(0)

  useEffect(() => {
    const handler = () => setInvalidateKey((k) => k + 1)
    window.addEventListener('shop-invalidate', handler)
    return () => window.removeEventListener('shop-invalidate', handler)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const run = async () => {
      try {
        let query = supabase.from('products').select('*').eq('active', true)

        if (category && category !== 'tutti') {
          const { data: allCats } = await supabase.from('categories').select('*')
          if (allCats) {
            const currentCat = allCats.find((c) => c.slug === category)
            if (currentCat) {
              const children = allCats.filter((c) => c.parent_id === currentCat.id)
              if (children.length > 0) {
                query = query.in('category', children.map((c) => c.slug))
              } else {
                query = query.eq('category', category)
              }
            } else {
              query = query.eq('category', category)
            }
          }
        }

        if (search?.trim()) query = query.ilike('name', `%${search.trim()}%`)
        if (sortBy === 'price-asc') query = query.order('price', { ascending: true })
        else if (sortBy === 'price-desc') query = query.order('price', { ascending: false })
        else if (sortBy === 'name') query = query.order('name', { ascending: true })
        else query = query.order('created_at', { ascending: false })
        if (limit) query = query.limit(limit)

        const { data, error } = await query
        console.log('run result:', cancelled, data?.length)
        if (cancelled) return
        if (error) throw error
        setProducts(data || [])
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [category, search, sortBy, limit, invalidateKey])

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
    const compress = (f) => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = (e) => {
        const img = new Image()
        img.onerror = reject
        img.onload = () => {
          const MAX = 1000
          let w = img.width, h = img.height
          if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
          if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Compressione fallita')), 'image/jpeg', 0.80)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(f)
    })

    const fileToUpload = file.size > 500000 ? await compress(file) : file
    const ext = file.size > 500000 ? 'jpg' : file.name.split('.').pop().toLowerCase()
    const path = `${productId}/${Date.now()}.${ext}`

    const uploadWithTimeout = new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout — connessione lenta, riprova')), 20000)
      try {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(path, fileToUpload, { cacheControl: '3600', upsert: true })
        clearTimeout(timer)
        if (error) reject(error)
        else resolve(data)
      } catch (err) {
        clearTimeout(timer)
        reject(err)
      }
    })

    await uploadWithTimeout
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  },

  async deleteImage(url) {
    try {
      const path = url.split('/product-images/')[1]
      if (!path) return
      await supabase.storage.from('product-images').remove([path])
    } catch (err) {
      console.warn('deleteImage:', err.message)
    }
  },
}

export function useAdminKeepAlive() {
  useEffect(() => {
    const interval = setInterval(async () => {
      await supabase.auth.getSession()
    }, 90_000)
    return () => clearInterval(interval)
  }, [])
}