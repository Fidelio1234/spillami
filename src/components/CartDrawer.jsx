import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import styles from './CartDrawer.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

export default function CartDrawer({ open, onClose }) {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-label="Carrello"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Il tuo carrello</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Chiudi carrello">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🛒</span>
              <p>Il carrello è vuoto</p>
              <button className="btn btn-outline" onClick={onClose}>
                Continua lo shopping
              </button>
            </div>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => {
                const atMaxStock = item.stock != null && item.quantity >= item.stock
                return (
                  <li key={item.id} className={styles.item}>
                    {/* Immagine reale o emoji fallback */}
                    <div
                      className={styles.itemImg}
                      style={{ background: item.color || '#F0EAE0' }}
                    >
                      {item.images?.[0]
                        ? <img
                            src={item.images[0]}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                          />
                        : <span>{item.emoji || '📌'}</span>
                      }
                    </div>

                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>{fmt(item.price)}</p>

                      <div className={styles.controls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Diminuisci"
                        >−</button>
                        <span className={styles.qty}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => !atMaxStock && updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Aumenta"
                          disabled={atMaxStock}
                          style={{ opacity: atMaxStock ? 0.3 : 1, cursor: atMaxStock ? 'not-allowed' : 'pointer' }}
                        >+</button>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeItem(item.id)}
                          aria-label="Rimuovi"
                        >Rimuovi</button>
                      </div>

                      {atMaxStock && (
                        <p style={{ fontSize: '11px', color: 'var(--terracotta)', marginTop: '4px' }}>
                          Quantità massima disponibile
                        </p>
                      )}
                    </div>

                    <p className={styles.itemTotal}>
                      {fmt(item.price * item.quantity)}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Subtotale</span>
              <span>{fmt(totalPrice)}</span>
            </div>
            <div className={styles.totalRow} style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>
              <span>Spedizione</span>
              <span>Calcolata al checkout</span>
            </div>
            <div className={styles.totalMain}>
              <span>Totale</span>
              <span>{fmt(totalPrice)}</span>
            </div>
            <Link
              to="/checkout"
              className="btn btn-terra"
              style={{ width: '100%', marginBottom: '10px' }}
              onClick={onClose}
            >
              Procedi al checkout →
            </Link>
            <button
              className="btn btn-outline"
              style={{ width: '100%' }}
              onClick={onClose}
            >
              Continua lo shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}