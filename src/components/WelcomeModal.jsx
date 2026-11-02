import { useState, useEffect } from 'react'

export default function WelcomeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!sessionStorage.getItem('welcomeSeen')) setOpen(true)
    } catch {
      setOpen(true)
    }
  }, [])

  const close = () => {
    try { sessionStorage.setItem('welcomeSeen', '1') } catch {}
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(30,28,24,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#F8F4ED', borderRadius: '20px', maxWidth: '540px', width: '100%',
          padding: '2.5rem 2rem', textAlign: 'center', position: 'relative',
          boxShadow: '0 24px 60px -20px rgba(30,28,24,0.4)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <button
          onClick={close}
          aria-label="Chiudi"
          style={{
            position: 'absolute', top: '14px', right: '16px', border: 'none',
            background: 'none', fontSize: '24px', lineHeight: 1, cursor: 'pointer',
            color: '#A09890',
          }}
        >×</button>

        <span style={{ fontSize: '40px', display: 'block', marginBottom: '1rem' }}>🎁</span>

        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '29px', fontWeight: 600, color: '#1E1C18', margin: '0 0 1rem',
        }}>
          Benvenuto su Smart-Shop
        </h2>

        <p style={{ fontSize: '19px', lineHeight: 1.7, color: '#6B6660', margin: '0 0 1.75rem' }}>
          La <strong style={{ color: '#C86B3C' }}>spedizione è sempre inclusa</strong> nel prezzo:
          non paghi nulla in più, è già tutto compreso.
        </p>

        <button
          onClick={close}
          className="btn btn-terra"
          style={{ padding: '12px 32px', fontSize: '15px' }}
        >
          Inizia a curiosare →
        </button>
      </div>
    </div>
  )
}