import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <img src="/logo.jpg" alt="Spillami" className={styles.logoImg} />
            </Link>
            <p className={styles.tagline}>
              Spille e accessori artigianali per chi ama gli animali.
              Ogni pezzo racconta una storia.
            </p>
          </div>

          {/* Links */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Shop</h3>
            <ul>
              <li><Link to="/shop">Tutti i prodotti</Link></li>
              <li><Link to="/shop?cat=cani">Cani</Link></li>
              <li><Link to="/shop?cat=gatti">Gatti</Link></li>
              <li><Link to="/shop?cat=uccelli">Uccelli</Link></li>
              <li><Link to="/shop?cat=conigli">Conigli</Link></li>
              <li><Link to="/shop?cat=collezione">Collezioni</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Info</h3>
            <ul>
              <li><Link to="#">Chi siamo</Link></li>
              <li><Link to="#">Spedizioni</Link></li>
              <li><Link to="#">Resi e rimborsi</Link></li>
              <li><Link to="#">FAQ</Link></li>
              <li><Link to="#">Contatti</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Account</h3>
            <ul>
              <li><Link to="/login">Accedi</Link></li>
              <li><Link to="/login">Registrati</Link></li>
              <li><Link to="/cart">Carrello</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Spillami. Tutti i diritti riservati.</p>
          <div className={styles.bottomLinks}>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Termini e condizioni</Link>
            <Link to="#">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
