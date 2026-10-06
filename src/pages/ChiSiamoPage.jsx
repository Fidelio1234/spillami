import styles from './LegalPage.module.css'

export default function ChiSiamoPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Chi siamo</h1>

        <section className={styles.section}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1E1C18' }}>
            Smart-Shop nasce dalla passione per gli animali e per l'artigianato. Ogni spilla, ogni accessorio che trovi qui è pensato per chi ama i propri animali e vuole portarli con sé — anche quando non può farlo davvero.
          </p>
        </section>

        <section className={styles.section}>
          <h2>La nostra storia</h2>
          <p>Tutto è iniziato con un'idea semplice: creare qualcosa di unico per chi condivide la vita con un animale. Niente produzione in serie, niente pezzi identici. Solo lavoro artigianale, fatto con cura e attenzione ai dettagli.</p>
        </section>

        <section className={styles.section}>
          <h2>I nostri prodotti</h2>
          <p>Ogni pezzo è realizzato a mano in Italia. Utilizziamo materiali selezionati per garantire qualità e durata. Dalle spille per cani ai gadget per amanti dei gatti, ogni articolo racconta una storia — quella del tuo animale.</p>
        </section>

        <section className={styles.section}>
          <h2>Il nostro impegno</h2>
          <p>Crediamo in un commercio responsabile: spedizioni gratuite, resi semplici, e un servizio clienti sempre disponibile. Per noi ogni cliente è parte della famiglia Spillami.</p>
        </section>

        <section className={styles.section}>
          <h2>Contattaci</h2>
          <p>Hai domande o vuoi saperne di più? Scrivici a{' '}
            <a href="mailto:smartshop2026@libero.it" style={{ color: '#C86B3C', fontWeight: '600', textDecoration: 'none' }}>
              smartshop2026@libero.it
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}