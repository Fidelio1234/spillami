/*import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import AccountPage from './pages/AccountPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

// Lazy import per l'admin (caricato solo se admin)
import { lazy, Suspense } from 'react'
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

// Route protetta per admin
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuthStore()
  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Caricamento...</div>
  if (!user || !isAdmin) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const init = useAuthStore((s) => s.init)

  // Inizializza auth Supabase all'avvio
  useEffect(() => {
    init()
  }, [init])

  return (
    <BrowserRouter>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <Routes>
        <Route path="/" element={<HomePage onCartOpen={() => setCartOpen(true)} />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />

        {/* Area Admin — solo per utenti con ruolo admin *//*}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Caricamento admin...</div>}>
                <AdminPage />
              </Suspense>
            </AdminRoute>
          }
        />

        {/* 404 *//*}
        <Route path="*" element={
          <main style={{ textAlign: 'center', padding: '8rem 2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', marginBottom: '1rem' }}>404</h1>
            <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem' }}>Pagina non trovata</p>
            <a href="/" className="btn btn-dark">Torna alla home</a>
          </main>
        } />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}



*/
















import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import AccountPage from './pages/AccountPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

import { lazy, Suspense } from 'react'
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

const MAINTENANCE = import.meta.env.VITE_MAINTENANCE === 'true'

// Pagina manutenzione inline
function MaintenancePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F4ED',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{ textAlign: 'center', maxWidth: '520px' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '2rem' }}>📌</span>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: '500',
          lineHeight: '1.15',
          marginBottom: '1.5rem',
          color: '#1E1C18',
        }}>
          Stiamo preparando<br />
          qualcosa di <em style={{ fontStyle: 'italic', color: '#C86B3C' }}>speciale</em>
        </h1>
        <div style={{ width: '48px', height: '1.5px', background: '#C86B3C', margin: '0 auto 1.5rem', borderRadius: '2px' }} />
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#6B6660', marginBottom: '2rem' }}>
          Spillami sta per aprire le porte.<br />
          Spille artigianali e accessori per chi ama gli animali.<br />
          Torna presto!
        </p>
        <span style={{
          display: 'inline-block',
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#A09890',
          border: '0.5px solid rgba(30,28,24,0.15)',
          padding: '6px 18px',
          borderRadius: '999px',
        }}>Apertura imminente</span>
      </div>
    </div>
  )
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuthStore()
  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Caricamento...</div>
  if (!user || !isAdmin) return <Navigate to="/login" replace />
  return children
}

// Wrapper per le route pubbliche — mostra manutenzione se attiva e non sei admin
function PublicRoute({ children }) {
  const { isAdmin, loading } = useAuthStore()
  if (loading) return null
  if (MAINTENANCE && !isAdmin) return <MaintenancePage />
  return children
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const init = useAuthStore((s) => s.init)

  useEffect(() => { init() }, [init])

  return (
    <BrowserRouter>
      <Routes>
        {/* Login e reset password sempre accessibili */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin sempre accessibile se sei admin */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Caricamento admin...</div>}>
                <AdminPage />
              </Suspense>
            </AdminRoute>
          }
        />

        {/* Tutte le altre route — bloccate in manutenzione */}
        <Route path="*" element={
          <PublicRoute>
            <Navbar onCartOpen={() => setCartOpen(true)} />
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <Routes>
              <Route path="/" element={<HomePage onCartOpen={() => setCartOpen(true)} />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="*" element={
                <main style={{ textAlign: 'center', padding: '8rem 2rem' }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', marginBottom: '1rem' }}>404</h1>
                  <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem' }}>Pagina non trovata</p>
                  <a href="/" className="btn btn-dark">Torna alla home</a>
                </main>
              } />
            </Routes>
            <Footer />
          </PublicRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}