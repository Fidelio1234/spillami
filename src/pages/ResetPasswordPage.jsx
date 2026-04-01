import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './LoginPage.module.css'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase gestisce il token dall'URL automaticamente
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Utente autenticato con il token di recovery — possiamo mostrare il form
      }
    })
    return () => subscription.unsubscribe()
  }, [])

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
          <Link to="/" className={styles.logo}>
            <img src="/logo.jpg" alt="Spillami" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          </Link>
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

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={`btn btn-terra ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Salvataggio...' : 'Imposta nuova password'}
          </button>
        </form>
      </div>
    </main>
  )
}