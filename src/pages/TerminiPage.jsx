import styles from './LegalPage.module.css'

export default function TerminiPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Termini e Condizioni di Vendita</h1>
        <p className={styles.meta}>DMI di Ivan De Mitri · Via Cagliari n. 6 · P.IVA 04623570753 · info@dmiservice.it</p>

        <section className={styles.section}>
          <h2>1. Informazioni generali</h2>
          <p>Il presente sito è gestito da DMI di Ivan De Mitri. L'acquisto di prodotti tramite www.smart-shop.it implica l'accettazione integrale dei presenti Termini e Condizioni.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Prodotti</h2>
          <p>Spillami vende accessori artigianali fatti a mano. Ogni prodotto è realizzato artigianalmente: potrebbero esserci lievi variazioni rispetto alle immagini mostrate sul sito.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Prezzi</h2>
          <p>I prezzi sono in Euro e comprensivi di IVA. Il Venditore si riserva il diritto di modificarli in qualsiasi momento. All'acquirente verrà addebitato il prezzo indicato al momento dell'ordine.</p>
        </section>

        <section className={styles.section}>
          <h2>4. Ordini</h2>
          <p>L'ordine si considera confermato al completamento del pagamento tramite Stripe. Il Cliente riceverà una email di conferma all'indirizzo fornito in fase di acquisto.</p>
        </section>

        <section className={styles.section}>
          <h2>5. Spedizioni</h2>
          <p>Spillami effettua spedizioni in Italia e all'estero. I tempi di consegna sono indicativi. I costi di spedizione sono indicati al momento del checkout e sono a carico del Cliente.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Diritto di Recesso</h2>
          <p>Ai sensi del D.Lgs. 206/2005, il Cliente ha diritto di recedere entro <strong>14 giorni</strong> dalla ricezione del prodotto, senza motivazione. Per esercitare il recesso scrivere a info@dmiservice.it indicando nome, numero ordine e prodotto da restituire.</p>
          <p>Le spese di restituzione sono a carico del Cliente. Il rimborso avverrà entro 14 giorni dal ricevimento del reso, con lo stesso metodo di pagamento. Il diritto di recesso non si applica a prodotti personalizzati.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Responsabilità</h2>
          <p>Il Venditore non è responsabile per ritardi causati da corrieri, eventi di forza maggiore o indirizzi di consegna errati forniti dal Cliente.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Foro competente</h2>
          <p>I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente il Foro di Lecce.</p>
        </section>

        <p className={styles.updated}>Ultimo aggiornamento: ottobre 2026</p>
      </div>
    </main>
  )
}