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

        {/* Area Admin — solo per utenti con ruolo admin */}
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

        {/* 404 */}
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