import styles from './LegalPage.module.css'

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy e Cookie Policy</h1>
        <p className={styles.meta}>DMI di Ivan De Mitri · Via Cagliari n. 6 · P.IVA 04623570753 · smartshop2026@libero.it</p>

        <section className={styles.section}>
          <h2>1. Titolare del trattamento</h2>
          <p>DMI di Ivan De Mitri, Via Cagliari n. 6, P.IVA 04623570753, email smartshop2026@libero.it.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Dati raccolti</h2>
          <p>In fase di acquisto o registrazione raccogliamo: nome e cognome, indirizzo email, indirizzo di spedizione. I dati di pagamento sono gestiti direttamente da Stripe e non vengono conservati da Spillami.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Finalità del trattamento</h2>
          <p>I dati vengono trattati per: elaborare e gestire gli ordini, comunicare lo stato della spedizione, adempiere agli obblighi legali e fiscali, inviare comunicazioni commerciali (solo previo consenso esplicito).</p>
        </section>

        <section className={styles.section}>
          <h2>4. Base giuridica</h2>
          <p>Il trattamento è basato sull'esecuzione del contratto (art. 6.1.b GDPR) e, per le comunicazioni commerciali, sul consenso (art. 6.1.a GDPR).</p>
        </section>

        <section className={styles.section}>
          <h2>5. Conservazione dei dati</h2>
          <p>I dati sono conservati per il tempo necessario e non oltre 10 anni per gli obblighi fiscali.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Diritti dell'interessato</h2>
          <p>Ai sensi del GDPR, l'utente può accedere, rettificare, cancellare i propri dati o opporsi al trattamento scrivendo a smartshop2026@libero.it.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Trasferimento dati</h2>
          <p>I dati possono essere trasferiti a Stripe (pagamenti), Supabase (database) e ai corrieri per la consegna degli ordini.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Cookie Policy</h2>
          <p>Il sito utilizza esclusivamente cookie tecnici necessari al funzionamento (autenticazione, sessione, carrello). Non vengono utilizzati cookie di profilazione. Stripe potrebbe impostare propri cookie tecnici per la gestione dei pagamenti.</p>
          <p>L'utente può disabilitare i cookie dal browser, ma ciò potrebbe compromettere il corretto funzionamento del sito.</p>
        </section>

        <p className={styles.updated}>Ultimo aggiornamento: ottobre 2026</p>
      </div>
    </main>
  )
}