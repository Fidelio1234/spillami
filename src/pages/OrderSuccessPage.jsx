import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import styles from './OrderSuccessPage.module.css'

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore((s) => s.clearCart)
  const [cleared, setCleared] = useState(false)

  // Svuota il carrello una volta sola
  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
  }, [cleared, clearCart])

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>Ordine confermato!</h1>
        <p className={styles.sub}>
          Grazie per il tuo acquisto su Spillami. Riceverai una email di conferma a breve
          con i dettagli della spedizione.
        </p>

        {sessionId && (
          <p className={styles.sessionId}>
            Riferimento ordine: <code>{sessionId.slice(-8).toUpperCase()}</code>
          </p>
        )}

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span>📦</span>
            <div>
              <p className={styles.infoTitle}>Spedizione</p>
              <p className={styles.infoText}>2–4 giorni lavorativi</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span>📧</span>
            <div>
              <p className={styles.infoTitle}>Email di conferma</p>
              <p className={styles.infoText}>In arrivo a breve</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span>↩️</span>
            <div>
              <p className={styles.infoTitle}>Resi</p>
              <p className={styles.infoText}>Gratuiti entro 30 giorni</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/shop" className="btn btn-dark">Continua lo shopping</Link>
          <Link to="/" className="btn btn-outline">Torna alla home</Link>
        </div>
      </div>
    </main>
  )
}
