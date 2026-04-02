import { useState, useRef, useEffect } from 'react'
import { Routes, Route, Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { productService } from '../../hooks/useProducts'
import { useCategories, categoryService } from '../../hooks/useCategories'
import { supabase } from '../../lib/supabase'
import styles from './AdminPage.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

// ── Hook prodotti admin con stato globale ─────────────────
// I prodotti vengono caricati UNA VOLTA e condivisi tra tutti i componenti
function useAdminProductsGlobal() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const loaded = useRef(false)

  const fetchAll = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) { setError(error.message); return }
    setProducts(data || [])
    loaded.current = true
  }

  useEffect(() => { fetchAll() }, [])

  return { products, loading, error, refetch: fetchAll }
}

// ── Modal conferma ────────────────────────────────────────
function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(30,28,24,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--paper)', borderRadius: 'var(--radius-lg)',
        padding: '2rem', maxWidth: '420px', width: '100%',
        border: '0.5px solid var(--border)', boxShadow: 'var(--shadow-lg)'
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, marginBottom: '0.75rem' }}>
          {title}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onCancel} disabled={loading}>Annulla</button>
          <button className="btn btn-terra" onClick={onConfirm} disabled={loading}
            style={{ background: '#c0392b', borderColor: '#c0392b' }}>
            {loading ? 'Eliminazione...' : 'Elimina'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Gestione Categorie ────────────────────────────────────
function CategoriesManager() {
  const { categories, loading, refetch } = useCategories()
  const [newCat, setNewCat] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')
  const [modal, setModal] = useState({ open: false, id: null, name: '' })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newCat.trim()) return
    setSaving(true)
    setError('')
    try {
      await categoryService.create(newCat)
      setNewCat('')
      await refetch()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(modal.id)
    try {
      await categoryService.delete(modal.id)
      await refetch()
      setModal({ open: false, id: null, name: '' })
    } catch (err) {
      setError('Errore: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className={styles.categoriesSection}>
      <ConfirmModal
        open={modal.open}
        title="Elimina categoria"
        message={`Sei sicuro di voler eliminare "${modal.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setModal({ open: false, id: null, name: '' })}
        loading={!!deleting}
      />
      <h3 className={styles.catSectionTitle}>Gestisci categorie</h3>
      <form className={styles.catForm} onSubmit={handleAdd}>
        <input className={styles.input} type="text" value={newCat}
          onChange={(e) => setNewCat(e.target.value)} placeholder="Es. Tartarughe, Pesci..." style={{ flex: 1 }} />
        <button type="submit" className="btn btn-terra" disabled={saving || !newCat.trim()}>
          {saving ? '...' : '+ Aggiungi'}
        </button>
      </form>
      {error && <p className={styles.errorMsg}>{error}</p>}
      <div className={styles.catList}>
        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--ink-faint)' }}>Caricamento...</p>
        ) : categories.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--ink-faint)' }}>Nessuna categoria ancora.</p>
        ) : categories.map((cat) => (
          <div key={cat.id} className={styles.catChip}>
            <span>{cat.name}</span>
            <button className={styles.catDelete}
              onClick={() => setModal({ open: true, id: cat.id, name: cat.name })}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────
function AdminDashboard({ products, loading }) {
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0)
  const lowStock = products.filter((p) => p.stock <= 5).length
  const categoriesCount = new Set(products.map((p) => p.category)).size

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <div className={styles.statsGrid}>
        {[
          { label: 'Prodotti totali', value: loading ? '...' : products.length, icon: '📌' },
          { label: 'Valore magazzino', value: loading ? '...' : fmt(totalValue), icon: '💰' },
          { label: 'Scorte basse', value: loading ? '...' : lowStock, icon: '⚠️' },
          { label: 'Categorie', value: loading ? '...' : categoriesCount, icon: '🗂️' },
        ].map(({ label, value, icon }) => (
          <div key={label} className={styles.statCard}>
            <span className={styles.statIcon}>{icon}</span>
            <div>
              <p className={styles.statValue}>{value}</p>
              <p className={styles.statLabel}>{label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.quickLinks}>
        <Link to="/admin/products" className="btn btn-dark">Gestisci prodotti →</Link>
        <Link to="/admin/products/new" className="btn btn-terra">+ Nuovo prodotto</Link>
      </div>
      <CategoriesManager />
    </div>
  )
}

// ── Lista prodotti ─────────────────────────────────────────
function AdminProducts({ products, loading, error, refetch }) {
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [modal, setModal] = useState({ open: false, id: null, name: '' })
  const navigate = useNavigate()

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    setDeleting(modal.id)
    try {
      await productService.delete(modal.id)
      await refetch()
      setModal({ open: false, id: null, name: '' })
    } catch (err) {
      alert('Errore eliminazione: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div>
      <div className={styles.listHeader}>
        <h1 className={styles.pageTitle}>Prodotti</h1>
        <Link to="/admin/products/new" className="btn btn-terra">+ Nuovo prodotto</Link>
      </div>
      <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>Caricamento...</p>
    </div>
  )
  if (error) return <div className={styles.errorMsg}>Errore: {error}</div>

  return (
    <div>
      <ConfirmModal
        open={modal.open}
        title="Elimina prodotto"
        message={`Sei sicuro di voler eliminare "${modal.name}"? L'operazione non può essere annullata.`}
        onConfirm={handleDelete}
        onCancel={() => setModal({ open: false, id: null, name: '' })}
        loading={!!deleting}
      />
      <div className={styles.listHeader}>
        <h1 className={styles.pageTitle}>Prodotti ({products.length})</h1>
        <Link to="/admin/products/new" className="btn btn-terra">+ Nuovo prodotto</Link>
      </div>
      <input type="text" className={styles.searchInput} placeholder="Cerca prodotto..."
        value={search} onChange={(e) => setSearch(e.target.value)} />
      {filtered.length === 0 ? (
        <div className={styles.emptyTable}>
          <p>Nessun prodotto trovato.</p>
          <Link to="/admin/products/new" className="btn btn-terra">+ Aggiungi il primo prodotto</Link>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Prodotto</span>
            <span>Categoria</span>
            <span>Prezzo</span>
            <span>Stock</span>
            <span>Azioni</span>
          </div>
          {filtered.map((p) => (
            <div key={p.id} className={styles.tableRow}>
              <div className={styles.productCell}>
                <div className={styles.productThumb} style={{ background: p.color || '#F0EAE0' }}>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                    : <span>{p.emoji || '📌'}</span>
                  }
                </div>
                <div>
                  <p className={styles.productName}>{p.name}</p>
                  {p.badge && <span className={styles.badge}>{p.badge}</span>}
                  {!p.active && <span className={styles.inactiveBadge}>Inattivo</span>}
                </div>
              </div>
              <span className={styles.cell}>{p.category}</span>
              <span className={styles.cell}>{fmt(p.price)}</span>
              <span className={`${styles.cell} ${p.stock <= 5 ? styles.lowStock : ''}`}>{p.stock}</span>
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => navigate(`/admin/products/${p.id}`)}>Modifica</button>
                <button className={styles.deleteBtn}
                  onClick={() => setModal({ open: true, id: p.id, name: p.name })}
                  disabled={deleting === p.id}>
                  {deleting === p.id ? '...' : 'Elimina'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Form prodotto ──────────────────────────────────────────
function ProductForm({ products, loading: productsLoading, refetch }) {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const fileInputRef = useRef()
  const { categories } = useCategories()

  const [productName, setProductName] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', stock: '',
    badge: '', emoji: '📌', color: '#F0EAE0', active: true, tags: '',
  })
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (isNew || initialized || productsLoading) return
    const existing = products.find((p) => p.id === id)
    if (!existing) return
    setProductName(existing.name || '')
    setForm({
      name: existing.name || '',
      description: existing.description || '',
      price: existing.price || '',
      category: existing.category || '',
      stock: existing.stock ?? '',
      badge: existing.badge || '',
      emoji: existing.emoji || '📌',
      color: existing.color || '#F0EAE0',
      active: existing.active ?? true,
      tags: existing.tags?.join(', ') || '',
    })
    setImages(existing.images || [])
    setInitialized(true)
  }, [products, productsLoading, id, isNew, initialized])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Immagine troppo grande. Max 5MB.'); return }
    setUploading(true)
    setError('')
    try {
      const tempId = id && id !== 'new' ? id : `temp-${Date.now()}`
      const url = await productService.uploadImage(file, tempId)
      setImages((prev) => [...prev, url])
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError('Errore upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = async (url, index) => {
    try {
      await productService.deleteImage(url)
      setImages((prev) => prev.filter((_, i) => i !== index))
    } catch (err) {
      setError('Errore rimozione: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        badge: form.badge.trim() || null,
        emoji: form.emoji.trim() || '📌',
        color: form.color,
        active: form.active,
        images,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      }
      if (isNew) await productService.create(payload)
      else await productService.update(id, payload)
      await refetch()
      setSaved(true)
      setTimeout(() => navigate('/admin/products'), 1200)
    } catch (err) {
      setError('Errore salvataggio: ' + err.message)
      setSaving(false)
    }
  }

  return (
    <div>
      <div className={styles.listHeader}>
        <h1 className={styles.pageTitle}>
          {isNew ? 'Nuovo prodotto' : `Modifica: ${productName || '...'}`}
        </h1>
        <button className="btn btn-outline" onClick={() => navigate('/admin/products')}>← Indietro</button>
      </div>
      <form className={styles.productForm} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formCol}>
            <div className={styles.field}>
              <label className={styles.label}>Nome prodotto *</label>
              <input className={styles.input} type="text" value={form.name}
                onChange={(e) => { set('name', e.target.value); setProductName(e.target.value) }}
                required placeholder="Es. Spilla Shiba Inu" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Descrizione *</label>
              <textarea className={styles.textarea} value={form.description}
                onChange={(e) => set('description', e.target.value)} required rows={4}
                placeholder="Descrizione del prodotto, materiali, dimensioni..." />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Prezzo (€) *</label>
                <input className={styles.input} type="number" step="0.01" min="0"
                  value={form.price} onChange={(e) => set('price', e.target.value)} required placeholder="12.90" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Quantità in stock *</label>
                <input className={styles.input} type="number" min="0"
                  value={form.stock} onChange={(e) => set('stock', e.target.value)} required placeholder="20" />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Categoria</label>
                <select className={styles.select} value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="">Seleziona categoria...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Badge (opzionale)</label>
                <input className={styles.input} type="text" value={form.badge}
                  onChange={(e) => set('badge', e.target.value)} placeholder="Es. Nuovo, Bestseller..." />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Emoji</label>
                <input className={styles.input} type="text" value={form.emoji}
                  onChange={(e) => set('emoji', e.target.value)} placeholder="📌" maxLength={2} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Colore sfondo</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={form.color} onChange={(e) => set('color', e.target.value)}
                    style={{ width: '44px', height: '38px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                  <input className={styles.input} type="text" value={form.color}
                    onChange={(e) => set('color', e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Tag (separati da virgola)</label>
              <input className={styles.input} type="text" value={form.tags}
                onChange={(e) => set('tags', e.target.value)} placeholder="es. cane, shiba, smaltata" />
            </div>
            <div className={styles.field}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
                Prodotto attivo (visibile nello shop)
              </label>
            </div>
          </div>

          <div className={styles.formCol}>
            <div className={styles.preview}>
              <div className={styles.previewImg} style={{ background: form.color }}>
                {images[0]
                  ? <img src={images[0]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span className={styles.previewEmoji}>{form.emoji}</span>
                }
                {form.badge && <span className={styles.previewBadge}>{form.badge}</span>}
              </div>
              <div className={styles.previewInfo}>
                <p className={styles.previewCat}>{form.category}</p>
                <p className={styles.previewName}>{form.name || 'Nome prodotto'}</p>
                <p className={styles.previewPrice}>{form.price ? fmt(parseFloat(form.price)) : '€ —'}</p>
              </div>
            </div>
            <div className={styles.imageUpload}>
              <p className={styles.label}>Immagini prodotto</p>
              {images.length > 0 && (
                <div className={styles.imageList}>
                  {images.map((url, i) => (
                    <div key={i} className={styles.imageItem}>
                      <img src={url} alt={`img ${i+1}`} className={styles.imageThumb} />
                      <button type="button" className={styles.imageRemove} onClick={() => removeImage(url, i)}>✕</button>
                      {i === 0 && <span className={styles.imagePrimary}>Principale</span>}
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.uploadArea}>
                <span>{uploading ? '⏳' : '📸'}</span>
                <p>{uploading ? 'Caricamento...' : "Clicca per aggiungere un'immagine"}</p>
                <p className={styles.uploadHint}>PNG, JPG, WEBP — max 5MB</p>
                <input ref={fileInputRef} type="file" accept="image/*"
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  onChange={handleImageUpload} disabled={uploading} />
              </div>
            </div>
          </div>
        </div>
        {error && <div className={styles.errorMsg}>{error}</div>}
        <div className={styles.formActions}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>Annulla</button>
          <button type="submit" className={`btn btn-terra ${saved ? styles.savedBtn : ''}`} disabled={saving}>
            {saved ? '✓ Salvato!' : saving ? 'Salvataggio...' : isNew ? 'Crea prodotto' : 'Salva modifiche'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Layout Admin — fetch UNA VOLTA SOLA qui ───────────────
export default function AdminPage() {
  const { products, loading, error, refetch } = useAdminProductsGlobal()

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <p className={styles.sidebarTitle}>Admin</p>
        <nav className={styles.sideNav}>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            📌 Prodotti
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            📦 Ordini
          </NavLink>
        </nav>
        <Link to="/" className={styles.backToSite}>← Torna al sito</Link>
      </aside>
      <main className={styles.main}>
        <Routes>
          <Route index element={<AdminDashboard products={products} loading={loading} />} />
          <Route path="products" element={<AdminProducts products={products} loading={loading} error={error} refetch={refetch} />} />
          <Route path="products/new" element={<ProductForm products={products} loading={loading} refetch={refetch} />} />
          <Route path="products/:id" element={<ProductForm products={products} loading={loading} refetch={refetch} />} />
          <Route path="orders" element={
            <div>
              <h1 className={styles.pageTitle}>Ordini</h1>
              <p style={{ color: 'var(--ink-muted)' }}>In arrivo con l'integrazione Stripe.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}
