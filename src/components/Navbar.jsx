import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useCategories } from '../hooks/useCategories'
import styles from './Navbar.module.css'

export default function Navbar({ onCartOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const { user, isAdmin } = useAuthStore()
  const { categories } = useCategories()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <img src="/logo.jpg" alt="Spillami" className={styles.logoImg} />
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          <li><NavLink to="/shop" end className={({ isActive }) => isActive ? styles.active : ''}>Shop</NavLink></li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <NavLink
                to={`/shop?cat=${cat.slug}`}
                className={({ isActive }) => isActive ? styles.active : ''}
              >
                {cat.name}
              </NavLink>
            </li>
          ))} 
        </ul>

        <div className={styles.right}>
          {user ? (
            <Link to="/account" className={styles.accountBtn} title="Il mio account">
              <span className={styles.avatar}>{user.email?.[0].toUpperCase()}</span>
            </Link>
          ) : (
            <Link to="/login" className={styles.loginLink}>Accedi</Link>
          )}

          <button className={styles.cartBtn} onClick={onCartOpen} aria-label="Apri carrello">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </button>

          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={menuOpen ? styles.barX1 : styles.bar} />
            <span className={menuOpen ? styles.barX2 : styles.bar} />
            <span className={menuOpen ? styles.barX3 : styles.bar} />
          </button>
        </div>
      </nav>
    </header>
  )
}