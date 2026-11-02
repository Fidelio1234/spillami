import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand */}
               






                   {/* Brand */}
          <div className={styles.brand} style={{ maxWidth: '260px' }}>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '22px', fontWeight: 600, color: '#F4ECDD', margin: '0 0 12px',
            }}>
              Smart-Shop.it
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#B9A896', margin: '0 0 16px' }}>
              Accessori e spille. Pezzi unici, spedizione sempre inclusa nel prezzo.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://instagram.com/TUO_PROFILO" target="_blank" rel="noopener noreferrer"
                 aria-label="Instagram"
                 style={{
                   width: '40px', height: '40px', borderRadius: '50%',
                   background: '#C86B3C', display: 'flex', alignItems: 'center',
                   justifyContent: 'center', color: '#F8F4ED',
                 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              <a href="https://facebook.com/TUO_PROFILO" target="_blank" rel="noopener noreferrer"
                 aria-label="Facebook"
                 style={{
                   width: '40px', height: '40px', borderRadius: '50%',
                   background: '#C86B3C', display: 'flex', alignItems: 'center',
                   justifyContent: 'center', color: '#F8F4ED',
                 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
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
              {/*<li><Link to="/cart">Carrello</Link></li>*/}
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
