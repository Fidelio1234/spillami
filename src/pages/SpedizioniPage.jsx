import styles from './LegalPage.module.css'

export default function SpedizioniPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Spedizioni</h1>
        <p className={styles.meta}>DMI di Ivan De Mitri · P.IVA 04261320757</p>

        <section className={styles.section}>
          <h2>Spedizione gratuita</h2>
          <p>Tutte le spedizioni sono <strong>gratuite</strong>, senza soglia minima di acquisto.</p>
        </section>

        <section className={styles.section}>
          <h2>Tempi di consegna</h2>
          <p>Gli ordini vengono preparati e spediti entro <strong>1-3 giorni lavorativi</strong> dalla conferma del pagamento. I tempi di consegna stimati sono di <strong>3-5 giorni lavorativi</strong> dalla spedizione.</p>
        </section>

        <section className={styles.section}>
          <h2>Dove spediamo</h2>
          <p>Spediamo in tutta <strong>Italia</strong>. Per spedizioni nelle isole i tempi potrebbero essere leggermente più lunghi.</p>
        </section>

        <section className={styles.section}>
          <h2>Tracciamento</h2>
          <p>Una volta spedito l'ordine, riceverai una email con il codice di tracciamento per seguire la consegna.</p>
        </section>

        <section className={styles.section}>
          <h2>Problemi con la spedizione?</h2>
          <p>Per qualsiasi problema contattaci a <strong>smartshop2026@libero.it</strong> e ti risponderemo il prima possibile.</p>
        </section>

        <p className={styles.updated}>Ultimo aggiornamento: ottobre 2026</p>
      </div>
    </main>
  )
}