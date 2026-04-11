import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useCategories } from '../hooks/useCategories'
import styles from './Navbar.module.css'

export default function Navbar({ onCartOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const items = useCartStore((s) => s.items)
  const { user, isAdmin } = useAuthStore()
  const { mainCategories, getChildren, hasChildren } = useCategories()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const location = useLocation()
  const timeoutRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setOpenDropdown(null) }, [location])

  const handleMouseEnter = (catId) => {
    clearTimeout(timeoutRef.current)
    setOpenDropdown(catId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <img src="/shop4.png" alt="Shop" className={styles.logoImg} />
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          <li><NavLink to="/shop" end className={({ isActive }) => isActive ? styles.active : ''}>Shop</NavLink></li>

          {mainCategories.map((cat) => (
            <li
              key={cat.id}
              className={styles.navItem}
              onMouseEnter={() => hasChildren(cat.id) ? handleMouseEnter(cat.id) : null}
              onMouseLeave={hasChildren(cat.id) ? handleMouseLeave : null}
            >
              <NavLink
                to={`/shop?cat=${cat.slug}`}
                className={({ isActive }) => `${isActive ? styles.active : ''} ${hasChildren(cat.id) ? styles.hasDropdown : ''}`}
              >
                {cat.name}
                {hasChildren(cat.id) && <span className={styles.dropdownArrow}>▾</span>}
              </NavLink>

              {hasChildren(cat.id) && openDropdown === cat.id && (
                <div
                  className={styles.dropdown}
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {getChildren(cat.id).map((child) => (
                    <Link
                      key={child.id}
                      to={`/shop?cat=${child.slug}`}
                      className={styles.dropdownItem}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}

          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => isActive ? styles.adminLink : styles.adminLinkInactive}>
                Admin
              </NavLink>
            </li>
          )}
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
