import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')
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

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src="/logo.jpg" alt="Spillami" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
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
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder={mode === 'register' ? 'Minimo 6 caratteri' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

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
