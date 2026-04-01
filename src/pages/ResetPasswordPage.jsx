import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './LoginPage.module.css'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Leggi il token dall'URL e verifica la sessione
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (tokenHash && type === 'recovery') {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
        .then(({ error }) => {
          if (error) {
            setError('Link non valido o scaduto. Richiedi un nuovo reset.')
          } else {
            setReady(true)
          }
        })
    } else {
      setError('Link non valido. Richiedi un nuovo reset dalla pagina di login.')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri.')
      return
    }

    if (password !== confirm) {
      setError('Le password non coincidono.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => navigate('/'), 2500)
  }

  if (success) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <a href="/" className={styles.logo}>
            <img src="/logo.jpg" alt="Spillami" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          </a>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '8px' }}>
              Password aggiornata!
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
              Verrai reindirizzato alla home tra pochi secondi...
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <a href="/" className={styles.logo}>
          <img src="/logo.jpg" alt="Spillami" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </a>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>
            Nuova password
          </button>
        </div>

        {!ready && !error && (
          <p style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px', padding: '1rem 0' }}>
            Verifica del link in corso...
          </p>
        )}

        {error && (
          <div style={{ marginTop: '1rem' }}>
            <p className={styles.error}>{error}</p>
            <a href="/login" className="btn btn-outline" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
              Torna al login
            </a>
          </div>
        )}

        {ready && (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Nuova password</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Minimo 6 caratteri"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirm">Conferma password</label>
              <input
                id="confirm"
                type="password"
                className={styles.input}
                placeholder="Ripeti la password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-terra ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? 'Salvataggio...' : 'Imposta nuova password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
