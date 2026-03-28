import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import styles from './CheckoutPage.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const { user } = useAuthStore()
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: Number(i.price),
          quantity: Number(i.quantity),
          images: i.images ?? [],
        })),
        customerEmail: user?.email ?? null,
      }

      const response = await fetch(
        'https://ovoqduqegbwucsmezczy.supabase.co/functions/v1/create-checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Errore dal server')
      if (!data.url) throw new Error('URL checkout non ricevuto')

      window.location.href = data.url
    } catch (err) {
      setError(err.message || 'Errore durante il checkout. Riprova.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className={styles.empty}>
        <h1>Il carrello è vuoto</h1>
        <p>Aggiungi qualche spilla prima di procedere.</p>
        <Link to="/shop" className="btn btn-dark">Vai allo shop</Link>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        <div className={styles.formSide}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Come funziona</h2>
            <div className={styles.infoSteps}>
              {[
                { n: '1', text: 'Clicca "Procedi al pagamento"' },
                { n: '2', text: 'Verrai reindirizzato a Stripe, la piattaforma di pagamento sicura' },
                { n: '3', text: "Inserisci i dati della carta e l'indirizzo di spedizione" },
                { n: '4', text: "Conferma il pagamento — tornerai qui con la conferma dell'ordine" },
              ].map(({ n, text }) => (
                <div key={n} className={styles.infoStep}>
                  <div className={styles.infoStepNum}>{n}</div>
                  <p className={styles.infoStepText}>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pagamenti accettati</h2>
            <div className={styles.paymentMethods}>
              {['Carta di credito', 'Carta di debito', 'Apple Pay', 'Google Pay'].map((m) => (
                <div key={m} className={styles.paymentMethod}>{m}</div>
              ))}
            </div>
          </section>

          {!user && (
            <div className={styles.loginPrompt}>
              <p>
                <Link to="/login" className={styles.loginLink}>Accedi</Link> per salvare il tuo ordine
                nello storico acquisti. Puoi comunque procedere come ospite.
              </p>
            </div>
          )}

          {error && <div className={styles.errorMsg}>{error}</div>}
        </div>

        <aside className={styles.summary}>
          <h2 className={styles.sectionTitle}>Riepilogo ordine</h2>
          <ul className={styles.summaryItems}>
            {items.map((item) => (
              <li key={item.id} className={styles.summaryItem}>
                <div className={styles.summaryImg} style={{ background: item.color || '#F0EAE0' }}>
                  {item.images && item.images[0]
                    ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>{item.emoji || '📌'}</span>
                  }
                </div>
                <div className={styles.summaryInfo}>
                  <p className={styles.summaryName}>{item.name}</p>
                  <p className={styles.summaryQty}>Quantità: {item.quantity}</p>
                </div>
                <span className={styles.summaryPrice}>{fmt(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotale</span>
              <span>{fmt(totalPrice)}</span>
            </div>
            <div className={styles.totalRow} style={{ color: 'var(--sage-dark)', fontSize: '13px' }}>
              <span>Spedizione</span>
              <span>Gratuita</span>
            </div>
            <div className={`${styles.totalRow} ${styles.totalMain}`}>
              <span>Totale</span>
              <span>{fmt(totalPrice)}</span>
            </div>
          </div>

          <button
            className="btn btn-terra"
            style={{ width: '100%', padding: '15px', fontSize: '14px' }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span className={styles.spinner} /> Reindirizzamento a Stripe...
              </span>
            ) : (
              'Procedi al pagamento'
            )}
          </button>

          <p className={styles.secureNote}>
            Pagamento gestito da Stripe — i tuoi dati sono al sicuro
          </p>
        </aside>
      </div>
    </main>
  )
}
