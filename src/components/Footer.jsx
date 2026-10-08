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
            <img src="/logo6.png" alt="Smart-Shop" className={styles.logoImg} />
            </Link>
            <p className={styles.tagline}>
              Spille e accessori artigianali anche per chi ama gli animali.
              Ogni pezzo racconta una storia.
            </p>
          </div>

          {/* Links */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Shop</h3>
            <ul>
              <li><Link to="/shop">Tutti i prodotti</Link></li>
             
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Info</h3>
            <ul>
            <li><Link to="/chi-siamo">Chi siamo</Link></li>
              <li><Link to="/spedizioni">Spedizioni</Link></li>
              <li><Link to="/resi">Resi e rimborsi</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contatti">Contatti</Link></li>
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
          <p>© {new Date().getFullYear()} SmartShop. Tutti i diritti riservati.</p>
          <div className={styles.bottomLinks}>
          <Link to="/privacy">Privacy Policy</Link>
  <Link to="/termini">Termini e condizioni</Link>
  <Link to="/privacy#cookie">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
