import styles from './LegalPage.module.css'
import { useState } from 'react'

const faqs = [
  {
    q: 'I prodotti sono davvero fatti a mano?',
    a: 'Sì, ogni spilla e accessorio è realizzato artigianalmente. Ogni pezzo è unico e potrebbe avere piccole variazioni rispetto alle foto.',
  },
  {
    q: 'Quali metodi di pagamento accettate?',
    a: 'Accettiamo carte di credito e debito (Visa, Mastercard, American Express) tramite Stripe. I pagamenti sono sicuri e cifrati.',
  },
  {
    q: 'La spedizione è gratuita?',
    a: 'Sì, la spedizione è completamente gratuita su tutti gli ordini, senza soglia minima.',
  },
  {
    q: 'Quanto tempo ci vuole per ricevere il mio ordine?',
    a: 'Prepariamo gli ordini entro 1-3 giorni lavorativi. La consegna avviene generalmente entro 3-5 giorni lavorativi dalla spedizione.',
  },
  {
    q: 'Posso restituire un prodotto?',
    a: 'Sì, hai 14 giorni dalla ricezione per esercitare il diritto di recesso. Il prodotto deve essere integro e non utilizzato. Consulta la nostra pagina Resi e rimborsi per tutti i dettagli.',
  },
  {
    q: 'Come faccio a tracciare il mio ordine?',
    a: 'Riceverai una email con il codice di tracciamento non appena il tuo ordine viene spedito.',
  },
  {
    q: 'Posso modificare o annullare un ordine?',
    a: 'Contattaci il prima possibile a smartshop2026@libero.it. Se l\'ordine non è ancora stato spedito, faremo il possibile per accontendarti.',
  },
  {
    q: 'Come posso contattarvi?',
    a: 'Puoi scriverci a smartshop2026@libero.it. Ti risponderemo entro 24-48 ore nei giorni lavorativi.',
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState(null)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Domande frequenti</h1>

        <div style={{ marginTop: '2rem' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: '1px solid rgba(30,28,24,0.1)',
                padding: '1.25rem 0',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'left',
                  fontFamily: "inherit",
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1E1C18',
                }}
              >
                {faq.q}
                <span style={{ fontSize: '1.25rem', color: '#C86B3C', flexShrink: 0 }}>
                  {open === i ? '−' : '+'}
                </span>
              </button>
              {open === i && (
                <p style={{ marginTop: '0.75rem', color: '#6B6660', lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <p className={styles.updated}>Ultimo aggiornamento: ottobre 2026</p>
      </div>
    </main>
  )
}