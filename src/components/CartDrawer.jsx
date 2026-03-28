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

  // Blocca scroll body quando il drawer è aperto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-label="Carrello"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Il tuo carrello</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Chiudi carrello">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Contenuto */}
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
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  {/* Immagine / emoji */}
                  <div
                    className={styles.itemImg}
                    style={{ background: item.color || '#F0EAE0' }}
                  >
                    <span>{item.emoji || '📌'}</span>
                  </div>

                  {/* Info */}
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>{fmt(item.price)}</p>

                    {/* Quantità */}
                    <div className={styles.controls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Diminuisci"
                      >−</button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumenta"
                      >+</button>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                        aria-label="Rimuovi"
                      >Rimuovi</button>
                    </div>
                  </div>

                  {/* Subtotale */}
                  <p className={styles.itemTotal}>
                    {fmt(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer con totale */}
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
