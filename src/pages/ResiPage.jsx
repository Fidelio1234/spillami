import styles from './LegalPage.module.css'

export default function ResiPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Resi e Rimborsi</h1>
        <p className={styles.meta}>DMI di Ivan De Mitri · Via Cagliari n. 6 · P.IVA 04623570753 · smartshop2026@libero.it</p>

        <section className={styles.section}>
          <h2>1. Diritto di recesso</h2>
          <p>Ai sensi del D.Lgs. 206/2005 (Codice del Consumo), hai diritto di recedere dall'acquisto entro <strong>14 giorni</strong> dalla data di ricezione del prodotto, senza necessità di fornire alcuna motivazione.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Come richiedere un reso</h2>
          <p>Per avviare una procedura di reso, scrivi a <strong>smartshop2026@libero.it</strong> indicando:</p>
          <ul>
            <li>Nome e cognome</li>
            <li>Numero d'ordine</li>
            <li>Prodotto da restituire</li>
            <li>Motivo del reso (facoltativo)</li>
          </ul>
          <p>Ti risponderemo entro 2 giorni lavorativi con le istruzioni per la restituzione.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Condizioni del prodotto restituito</h2>
          <p>Il prodotto deve essere restituito nelle stesse condizioni in cui è stato ricevuto: integro, non utilizzato e nella confezione originale. Prodotti danneggiati o manomessi non potranno essere accettati.</p>
        </section>

        <section className={styles.section}>
          <h2>4. Spese di restituzione</h2>
          <p>Le spese di spedizione per la restituzione del prodotto sono a carico del Cliente. Consigliamo di utilizzare un servizio con tracciamento, in quanto non siamo responsabili di eventuali smarrimenti durante il trasporto.</p>
        </section>

        <section className={styles.section}>
          <h2>5. Rimborso</h2>
          <p>Una volta ricevuto e verificato il prodotto reso, effettueremo il rimborso entro <strong>14 giorni</strong> utilizzando lo stesso metodo di pagamento usato per l'acquisto. Le spese di spedizione originali non sono rimborsabili.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Prodotti esclusi dal diritto di recesso</h2>
          <p>Il diritto di recesso non si applica a:</p>
          <ul>
            <li>Prodotti personalizzati o realizzati su misura</li>
            <li>Prodotti sigillati che non possono essere restituiti per motivi igienici, se aperti dopo la consegna</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Prodotto difettoso o errato</h2>
          <p>Se hai ricevuto un prodotto difettoso o diverso da quello ordinato, scrivici entro <strong>7 giorni</strong> dalla ricezione a info@dmiservice.it con una foto del problema. Provvederemo alla sostituzione o al rimborso completo, incluse le spese di spedizione.</p>
        </section>

        <p className={styles.updated}>Ultimo aggiornamento: ottobre 2026</p>
      </div>
    </main>
  )
}