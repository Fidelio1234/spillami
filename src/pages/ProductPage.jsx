import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useProduct, useProducts } from '../hooks/useProducts'
import styles from './ProductPage.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

export default function ProductPage() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const addItem = useCartStore((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const { products: related } = useProducts({
    category: product?.category,
    limit: 5,
  })
  const relatedFiltered = related.filter((p) => p.id !== id).slice(0, 4)

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.loadingPulse} />
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className={styles.notFound}>
        <h1>Prodotto non trovato</h1>
        <Link to="/shop" className="btn btn-dark">Torna allo shop</Link>
      </main>
    )
  }

  const images = product.images?.length ? product.images : null

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/shop">Shop</Link>
        <span>›</span>
        <Link to={`/shop?cat=${product.category}`}>{product.category}</Link>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      <div className={styles.product}>
        {/* Immagini */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrap} style={{ background: product.color || '#F0EAE0' }}>
            {images ? (
              <img src={images[activeImg]} alt={product.name} className={styles.productImg} />
            ) : (
              <span className={styles.productEmoji}>{product.emoji || '📌'}</span>
            )}
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
          </div>

          {/* Thumbnails se ci sono più immagini */}
          {images && images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <p className={styles.cat}>{product.category}</p>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.priceRow}>
            <span className={styles.price}>{fmt(product.price)}</span>
            {product.stock > 0 && product.stock <= 8 && (
              <span className={styles.stockWarn}>⚠️ Solo {product.stock} disponibili</span>
            )}
            {product.stock === 0 && <span className={styles.outOfStock}>Esaurito</span>}
          </div>

          <p className={styles.desc}>{product.description}</p>

          {product.tags?.length > 0 && (
            <div className={styles.tags}>
              {product.tags.map((t) => (
                <span key={t} className={styles.tag}>#{t}</span>
              ))}
            </div>
          )}

          {product.stock > 0 && (
            <div className={styles.addSection}>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button className={styles.qtyBtn} onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>+</button>
              </div>
              <button
                className={`btn btn-terra ${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
                onClick={handleAdd}
              >
                {added ? '✓ Aggiunto al carrello' : 'Aggiungi al carrello'}
              </button>
            </div>
          )}

          <div className={styles.extras}>
            <div className={styles.extra}><span>📦</span><span>Spedizione in 2–4 giorni lavorativi</span></div>
            <div className={styles.extra}><span>↩️</span><span>Reso gratuito entro 30 giorni</span></div>
            <div className={styles.extra}><span>🔒</span><span>Pagamento sicuro con Stripe</span></div>
          </div>
        </div>
      </div>

      {relatedFiltered.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>Potrebbero piacerti anche</h2>
          <div className={styles.relatedGrid}>
            {relatedFiltered.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className={styles.relCard}>
                <div className={styles.relImg} style={{ background: p.color || '#F0EAE0' }}>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>{p.emoji || '📌'}</span>
                  }
                </div>
                <div className={styles.relInfo}>
                  <p className={styles.relName}>{p.name}</p>
                  <p className={styles.relPrice}>{fmt(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
