import styles from './LegalPage.module.css'

export default function ContattiPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Contatti</h1>
        <p className={styles.meta}>DMI di Ivan De Mitri · P.IVA 04261320757</p>

        <section className={styles.section}>
          <h2>Scrivici</h2>
          <p>Per qualsiasi domanda, informazione o assistenza puoi contattarci via email:</p>
          <p style={{ marginTop: '0.75rem' }}>
            <a
              href="mailto:smartshop2026@libero.it"
              style={{ color: '#C86B3C', fontWeight: '600', textDecoration: 'none' }}
            >
              smartshop2026@libero.it
            </a>
          </p>
          <p style={{ marginTop: '0.75rem', color: '#6B6660' }}>
            Ti risponderemo entro <strong>24-48 ore</strong> nei giorni lavorativi.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Sede legale</h2>
          <p>DMI di Ivan De Mitri<br />P.IVA 04261320757<br />Lecce, Italia</p>
        </section>
      </div>
    </main>
  )
}