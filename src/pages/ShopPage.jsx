import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import styles from './ShopPage.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: '40%', height: '10px' }} />
        <div className={styles.skeletonLine} style={{ width: '80%', height: '14px' }} />
        <div className={styles.skeletonLine} style={{ width: '60%', height: '12px' }} />
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [addedIds, setAddedIds] = useState(new Set())
  const addItem = useCartStore((s) => s.addItem)

  const activeCategory = searchParams.get('cat') || 'tutti'

  const { products: allProducts, loading, error } = useProducts({ sortBy })
  const { categories: dbCategories } = useCategories()

  const CATEGORIES = useMemo(() => [
    { id: 'tutti', label: 'Tutti' },
    ...dbCategories.map((c) => ({ id: c.slug, label: c.name }))
  ], [dbCategories])

  const products = useMemo(() => {
    let list = allProducts
    if (activeCategory !== 'tutti') {
      list = list.filter((p) => p.category === activeCategory)
    }




 if (search.trim()) {
  const q = search.toLowerCase()
  list = list.filter((p) => {
    const catLabel = dbCategories.find((c) => c.slug === p.category)?.name?.toLowerCase() || ''
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      catLabel.includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    )
  })
}


    return list
  }, [allProducts, activeCategory, search])

  const countByCategory = useMemo(() => {
    const map = {}
    allProducts.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1 })
    return map
  }, [allProducts])

  const setCategory = (cat) => {
    if (cat === 'tutti') searchParams.delete('cat')
    else searchParams.set('cat', cat)
    setSearchParams(searchParams)
  }

  const handleAdd = (product) => {
    addItem(product, 1)
    setAddedIds((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedIds((prev) => { const n = new Set(prev); n.delete(product.id); return n })
    }, 1400)
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.pageHeadInner}>
          <h1 className={styles.pageTitle}>Shop</h1>
          <p className={styles.pageCount}>
            {loading ? '...' : `${products.length} prodott${products.length === 1 ? 'o' : 'i'}`}
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sideBlock}>
            <h2 className={styles.sideLabel}>Cerca</h2>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" className={styles.searchInput} placeholder="Cerca..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          <div className={styles.sideBlock}>
            <h2 className={styles.sideLabel}>Categoria</h2>
            <ul className={styles.catList}>
              {CATEGORIES.map(({ id, label }) => (
                <li key={id}>
                  <button
                    className={`${styles.catBtn} ${activeCategory === id ? styles.catActive : ''}`}
                    onClick={() => setCategory(id)}
                  >
                    {label}
                    <span className={styles.catCount}>
                      {id === 'tutti' ? allProducts.length : (countByCategory[id] || 0)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sideBlock}>
            <h2 className={styles.sideLabel}>Ordina per</h2>
            <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Più recenti</option>
              <option value="price-asc">Prezzo: crescente</option>
              <option value="price-desc">Prezzo: decrescente</option>
              <option value="name">Nome A–Z</option>
            </select>
          </div>
        </aside>

        <section className={styles.grid}>
          {error && <div className={styles.empty}><span className={styles.emptyIcon}>⚠️</span><p>Errore: {error}</p></div>}
          {loading && !error && Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          {!loading && !error && products.length === 0 && (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🔍</span>
              <p>Nessun prodotto trovato{search ? ` per "${search}"` : ''}.</p>
              {search && <button className="btn btn-outline" onClick={() => setSearch('')}>Cancella ricerca</button>}
            </div>
          )}
          {!loading && !error && products.map((product) => {
            const added = addedIds.has(product.id)
            const imgUrl = product.images?.[0]
            return (
              <article key={product.id} className={styles.card}>
                <Link to={`/product/${product.id}`} className={styles.cardImgLink}>
                  <div className={styles.cardImg} style={{ background: product.color || '#F0EAE0' }}>
                    {imgUrl
                      ? <img src={imgUrl} alt={product.name} className={styles.cardImgReal} />
                      : <span className={styles.cardEmoji}>{product.emoji || '📌'}</span>
                    }
                    {product.badge && <span className={styles.cardBadge}>{product.badge}</span>}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className={styles.stockWarning}>Solo {product.stock} rimast{product.stock === 1 ? 'a' : 'e'}</span>
                    )}
                  </div>
                </Link>
                <div className={styles.cardBody}>
                  <p className={styles.cardCat}>{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className={styles.cardName}>{product.name}</h3>
                  </Link>
                  <p className={styles.cardDesc}>{product.description?.slice(0, 70)}…</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{fmt(product.price)}</span>
                    <button
                      className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
                      onClick={() => handleAdd(product)}
                      disabled={product.stock === 0}
                    >
                      {added ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}
