import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './LoginPage.module.css'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })

    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    if (tokenHash && type === 'recovery') {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
        .then(({ error }) => {
          if (error) setError('Link non valido o scaduto.')
          else setReady(true)
        })
    }

    return () => subscription.unsubscribe()
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { setError('Minimo 6 caratteri.'); return }
    if (password !== confirm) { setError('Le password non coincidono.'); return }
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message || 'Errore durante il salvataggio. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  const eyeBtn = (show, toggle) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={show ? 'Nascondi password' : 'Mostra password'}
      style={{
        position: 'absolute', right: '12px', top: '50%',
        transform: 'translateY(-50%)', background: 'none',
        border: 'none', cursor: 'pointer', color: 'var(--ink-faint)',
        fontSize: '16px', padding: 0, lineHeight: 1,
      }}
    >
      {show ? '🙈' : '👁️'}
    </button>
  )

  if (success) return (
    <main className={styles.page}>
      <div className={styles.card}>
        <a href="/" className={styles.logo}>
          <img src="/logo.jpg" alt="Spillami" style={{ height: '40px', width: 'auto' }} />
        </a>
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: '40px', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>Password aggiornata!</h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '8px' }}>Reindirizzamento in corso...</p>
        </div>
      </div>
    </main>
  )

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <a href="/" className={styles.logo}>
          <img src="/logo6.png" alt="Smart-Shop" style={{ height: '40px', width: 'auto' }} />
        </a>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>Nuova password</button>
        </div>
        {!ready && !error && <p style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px', padding: '1rem 0' }}>Verifica in corso...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {ready && (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>Nuova password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 6 caratteri"
                  required
                  style={{ paddingRight: '44px' }}
                />
                {eyeBtn(showPassword, () => setShowPassword(!showPassword))}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Conferma password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={styles.input}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Ripeti la password"
                  required
                  style={{ paddingRight: '44px' }}
                />
                {eyeBtn(showConfirm, () => setShowConfirm(!showConfirm))}
              </div>
            </div>
            <button type="submit" className={`btn btn-terra ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Salvataggio...' : 'Imposta nuova password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}