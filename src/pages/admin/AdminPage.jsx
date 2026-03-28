import { useState, useRef } from 'react'
import { Routes, Route, Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useAdminProducts, productService } from '../../hooks/useProducts'
import styles from './AdminPage.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

// ── Dashboard ─────────────────────────────────────────────
function AdminDashboard() {
  const { products, loading } = useAdminProducts()

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0)
  const lowStock = products.filter((p) => p.stock <= 5).length
  const categories = new Set(products.map((p) => p.category)).size

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <div className={styles.statsGrid}>
        {[
          { label: 'Prodotti totali', value: loading ? '...' : products.length, icon: '📌' },
          { label: 'Valore magazzino', value: loading ? '...' : fmt(totalValue), icon: '💰' },
          { label: 'Scorte basse', value: loading ? '...' : lowStock, icon: '⚠️' },
          { label: 'Categorie', value: loading ? '...' : categories, icon: '🗂️' },
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
    </div>
  )
}

// ── Lista prodotti ─────────────────────────────────────────
function AdminProducts() {
  const { products, loading, error, refetch } = useAdminProducts()
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Eliminare "${name}"?`)) return
    setDeleting(id)
    try {
      await productService.delete(id)
      await refetch()
    } catch (err) {
      alert('Errore eliminazione: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div className={styles.loading}>Caricamento prodotti...</div>
  if (error) return <div className={styles.errorMsg}>Errore: {error}</div>

  return (
    <div>
      <div className={styles.listHeader}>
        <h1 className={styles.pageTitle}>Prodotti ({products.length})</h1>
        <Link to="/admin/products/new" className="btn btn-terra">+ Nuovo prodotto</Link>
      </div>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Cerca prodotto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
                <button className={styles.editBtn} onClick={() => navigate(`/admin/products/${p.id}`)}>
                  Modifica
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(p.id, p.name)}
                  disabled={deleting === p.id}
                >
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
function ProductForm() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const fileInputRef = useRef()

  const { products } = useAdminProducts()
  const existing = !isNew ? products.find((p) => p.id === id) : null

  const [form, setForm] = useState({
    name: existing?.name || '',
    description: existing?.description || '',
    price: existing?.price || '',
    category: existing?.category || 'cani',
    stock: existing?.stock ?? '',
    badge: existing?.badge || '',
    emoji: existing?.emoji || '📌',
    color: existing?.color || '#F0EAE0',
    active: existing?.active ?? true,
    tags: existing?.tags?.join(', ') || '',
  })

  const [images, setImages] = useState(existing?.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Upload immagine
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Immagine troppo grande. Max 5MB.')
      return
    }

    setUploading(true)
    setError('')
    try {
      // Per prodotti nuovi usiamo un ID temporaneo
      const tempId = id || `temp-${Date.now()}`
      const url = await productService.uploadImage(file, tempId)
      setImages((prev) => [...prev, url])
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
      setError('Errore rimozione immagine: ' + err.message)
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

      if (isNew) {
        await productService.create(payload)
      } else {
        await productService.update(id, payload)
      }

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
          {isNew ? 'Nuovo prodotto' : `Modifica: ${existing?.name || '...'}`}
        </h1>
        <button className="btn btn-outline" onClick={() => navigate('/admin/products')}>← Indietro</button>
      </div>

      <form className={styles.productForm} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {/* Colonna sinistra */}
          <div className={styles.formCol}>
            <div className={styles.field}>
              <label className={styles.label}>Nome prodotto *</label>
              <input className={styles.input} type="text" value={form.name}
                onChange={(e) => set('name', e.target.value)} required placeholder="Es. Spilla Shiba Inu" />
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
                  <option value="cani">Cani</option>
                  <option value="gatti">Gatti</option>
                  <option value="uccelli">Uccelli</option>
                  <option value="conigli">Conigli</option>
                  <option value="collezione">Collezione speciale</option>
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

          {/* Colonna destra — immagini + preview */}
          <div className={styles.formCol}>
            {/* Preview card */}
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
                <p className={styles.previewPrice}>
                  {form.price ? fmt(parseFloat(form.price)) : '€ —'}
                </p>
              </div>
            </div>

            {/* Upload immagini */}
            <div className={styles.imageUpload}>
              <p className={styles.label}>Immagini prodotto</p>

              {/* Immagini caricate */}
              {images.length > 0 && (
                <div className={styles.imageList}>
                  {images.map((url, i) => (
                    <div key={i} className={styles.imageItem}>
                      <img src={url} alt={`img ${i+1}`} className={styles.imageThumb} />
                      <button
                        type="button"
                        className={styles.imageRemove}
                        onClick={() => removeImage(url, i)}
                      >✕</button>
                      {i === 0 && <span className={styles.imagePrimary}>Principale</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Area upload */}
              <div
                className={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
              >
                <span>{uploading ? '⏳' : '📸'}</span>
                <p>{uploading ? 'Caricamento...' : 'Clicca per aggiungere un\'immagine'}</p>
                <p className={styles.uploadHint}>PNG, JPG, WEBP — max 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
            </div>
          </div>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <div className={styles.formActions}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>
            Annulla
          </button>
          <button
            type="submit"
            className={`btn btn-terra ${saved ? styles.savedBtn : ''}`}
            disabled={saving}
          >
            {saved ? '✓ Salvato!' : saving ? 'Salvataggio...' : isNew ? 'Crea prodotto' : 'Salva modifiche'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Layout Admin ───────────────────────────────────────────
export default function AdminPage() {
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
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
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
