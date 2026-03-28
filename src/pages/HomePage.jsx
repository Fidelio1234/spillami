import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useProducts } from '../hooks/useProducts'
import styles from './HomePage.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

export default function HomePage() {
  const addItem = useCartStore((s) => s.addItem)

  // Carica prodotti con badge (in evidenza) — limite 4
  const { products: featured, loading } = useProducts({ limit: 4 })

  const handleAdd = (product, e) => {
    addItem(product, 1)
    const btn = e.currentTarget
    const original = btn.textContent
    btn.textContent = '✓'
    btn.style.background = 'var(--sage)'
    setTimeout(() => {
      btn.textContent = original
      btn.style.background = ''
    }, 1200)
  }

  return (
    <main>
      {/* ── HERO ─────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>📌 Spille artigianali per chi ama gli animali</p>
          <h1 className={styles.heroTitle}>
            Porta il tuo<br />
            <em>amico del cuore</em><br />
            sempre con te
          </h1>
          <p className={styles.heroSub}>
            Spille smaltate, accessori e collezioni pensate per chi ha un animale
            speciale nella propria vita. Ogni pezzo è unico, colorato, irresistibile.
          </p>
          <div className={styles.heroActions}>
            <Link to="/shop" className="btn btn-dark">Scopri il catalogo</Link>
            <Link to="/shop?cat=collezione" className="btn btn-outline">Collezioni speciali</Link>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroGrid}>
            {['🐕','🐈','🐾','🦜','🐰','🦉','😺','🐩'].map((e, i) => (
              <div key={i} className={styles.heroEmoji} style={{ animationDelay: `${i * 0.1}s` }}>{e}</div>
            ))}
          </div>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeNum}>+50</span>
            <span className={styles.heroBadgeText}>design unici</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────── */}
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={styles.marquee}>
          {Array(6).fill('📌 Spillami · Spille per amanti degli animali · ').map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── PRODOTTI IN EVIDENZA ──────────────── */}
      <section className={styles.featured}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>In evidenza</h2>
            <p className={styles.sectionSub}>I preferiti del momento</p>
          </div>
          <Link to="/shop" className="btn btn-outline">Vedi tutti →</Link>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonImg} />
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine} style={{ width: '40%' }} />
                  <div className={styles.skeletonLine} style={{ width: '75%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nessun prodotto ancora — <Link to="/admin/products/new">aggiungine uno dall'admin</Link>.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {featured.map((product) => {
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
                    </div>
                  </Link>
                  <div className={styles.cardBody}>
                    <p className={styles.cardCat}>{product.category}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className={styles.cardName}>{product.name}</h3>
                    </Link>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardPrice}>{fmt(product.price)}</span>
                      <button
                        className={styles.addBtn}
                        onClick={(e) => handleAdd(product, e)}
                        aria-label={`Aggiungi ${product.name} al carrello`}
                      >+</button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* ── VALORI ────────────────────────────── */}
      <section className={styles.values}>
        {[
          { icon: '✋', title: 'Fatto a mano', desc: 'Ogni spilla è smaltata e rifinita artigianalmente.' },
          { icon: '🌿', title: 'Materiali sicuri', desc: 'Smalti atossici, metalli nickel-free e chiusure sicure.' },
          { icon: '📦', title: 'Spedizioni veloci', desc: 'Spediamo in tutta Italia in 2–4 giorni lavorativi.' },
          { icon: '💛', title: 'Fatto con amore', desc: 'Ogni design nasce dall\'amore per gli animali.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className={styles.value}>
            <span className={styles.valueIcon}>{icon}</span>
            <h3 className={styles.valueTitle}>{title}</h3>
            <p className={styles.valueDesc}>{desc}</p>
          </div>
        ))}
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Qual è il tuo animale del cuore?</h2>
        <p className={styles.ctaSub}>Trova la spilla perfetta per te o da regalare.</p>
        <div className={styles.ctaLinks}>
          {['cani','gatti','uccelli','conigli'].map((cat) => (
            <Link key={cat} to={`/shop?cat=${cat}`} className={styles.ctaChip}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
