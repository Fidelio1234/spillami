import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import styles from './LoginPage.module.css'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const { signIn, signUp } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate('/')
      } else {
        await signUp(email, password, fullName)
        setSuccess('Registrazione completata! Controlla la tua email per confermare l\'account.')
      }
    } catch (err) {
      setError(err.message || 'Qualcosa è andato storto. Riprova.')
    } finally {
      setLoading(false)
    }
  }


  const handleForgotPassword = async () => {
    if (!email) {
      setError('Inserisci la tua email prima di procedere.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://smart-shop.it/reset-password',
      })
      if (error) throw error
      setSuccess('Email inviata! Controlla la tua casella per reimpostare la password.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }



  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <Link to="/" className={styles.logo} style={{ display: 'flex', justifyContent: 'center' }}>
  <img src="/logo6.png" alt="Smart-Shop" style={{ height: '150px', width: 'auto', objectFit: 'contain' }} />
</Link>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
          >
            Accedi
          </button>
          <button
            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
            onClick={() => { setMode('register'); setError(''); setSuccess('') }}
          >
            Registrati
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="fullName">Nome completo</label>
              <input
                id="fullName"
                type="text"
                className={styles.input}
                placeholder="Mario Rossi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="mario@esempio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder={mode === 'register' ? 'Minimo 6 caratteri' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-faint)',
                  fontSize: '16px',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {mode === 'login' && (
  <div style={{ textAlign: 'right', marginTop: '-8px' }}>
    <button
      type="button"
      className={styles.switchBtn}
      onClick={handleForgotPassword}
    >
      Password dimenticata?
    </button>
  </div>
)}

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}

          <button
            type="submit"
            className={`btn btn-terra ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading
              ? 'Attendere...'
              : mode === 'login' ? 'Accedi' : 'Crea account'}
          </button>
        </form>

        <p className={styles.footer}>
          {mode === 'login'
            ? 'Non hai un account? '
            : 'Hai già un account? '}
          <button
            className={styles.switchBtn}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess('') }}
          >
            {mode === 'login' ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </div>
    </main>
  )
}