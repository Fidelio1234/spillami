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

              <a
  href="https://www.tiktok.com/@TUO_PROFILO"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="TikTok"
  style={{
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#C86B3C',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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
