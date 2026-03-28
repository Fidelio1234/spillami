# 📌 Spillami — Ecommerce

Spille e accessori artigianali per gli amanti degli animali.

## Stack

- **React 18** + **Vite**
- **React Router v6** — navigazione
- **Zustand** — state management (carrello + auth)
- **Supabase** — database, autenticazione, storage immagini
- **CSS Modules** — stile component-scoped
- **Stripe** — pagamenti (fase 2)

---

## Avvio rapido

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env
```

Apri `.env` e inserisci le tue credenziali Supabase:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
```

Trovi questi valori su [supabase.com](https://supabase.com) →
il tuo progetto → **Settings → API**.

### 3. Avvia il server di sviluppo

```bash
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173).

---

## Struttura del progetto

```
src/
├── components/
│   ├── Navbar.jsx          # Navbar sticky con carrello
│   ├── Navbar.module.css
│   ├── CartDrawer.jsx      # Drawer carrello laterale
│   ├── CartDrawer.module.css
│   ├── Footer.jsx
│   └── Footer.module.css
│
├── pages/
│   ├── HomePage.jsx        # Home con hero + prodotti in evidenza
│   ├── ShopPage.jsx        # Catalogo con filtri + ricerca
│   ├── ProductPage.jsx     # Dettaglio prodotto
│   ├── LoginPage.jsx       # Login / Registrazione
│   ├── CheckoutPage.jsx    # Checkout (Stripe da connettere)
│   └── admin/
│       ├── AdminPage.jsx   # Pannello admin (dashboard + prodotti)
│       └── AdminPage.module.css
│
├── store/
│   ├── cartStore.js        # Zustand — carrello (persiste in localStorage)
│   └── authStore.js        # Zustand — autenticazione Supabase
│
├── data/
│   └── products.js         # Dati mock (da sostituire con Supabase)
│
├── lib/
│   └── supabase.js         # Client Supabase
│
├── App.jsx                 # Router principale
├── main.jsx                # Entry point
└── index.css               # Design system globale
```

---

## Database Supabase — Schema SQL

Esegui questo SQL nel **SQL Editor** di Supabase per creare le tabelle:

```sql
-- Profili utenti (collegati a auth.users)
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  address text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Prodotti
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null,
  stock integer not null default 0,
  badge text,
  emoji text,
  color text,
  images text[],
  tags text[],
  created_at timestamptz default now()
);

-- Ordini
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  status text default 'pending',
  total numeric(10,2) not null,
  stripe_session_id text,
  created_at timestamptz default now()
);

-- Righe ordine
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer not null,
  price_at_purchase numeric(10,2) not null
);

-- RLS: ogni utente vede solo i propri ordini
alter table orders enable row level security;
create policy "Utenti vedono i propri ordini"
  on orders for select using (auth.uid() = user_id);

-- RLS: prodotti visibili a tutti
alter table products enable row level security;
create policy "Prodotti pubblici"
  on products for select using (true);

-- RLS: solo admin può modificare prodotti
create policy "Solo admin modifica prodotti"
  on products for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
```

### Rendere un utente admin

Dopo la registrazione, vai su Supabase → **Table Editor → profiles**
e imposta `role = 'admin'` per il tuo utente.

---

## Prossimi passi

- [ ] Connettere `ShopPage` e `ProductPage` a Supabase (fetch prodotti)
- [ ] Connettere il form Admin all'insert/update su Supabase
- [ ] Upload immagini con Supabase Storage
- [ ] Integrare Stripe Checkout per i pagamenti
- [ ] Pagina account utente (storico ordini)

---

## Build per produzione

```bash
npm run build
```

L'output è nella cartella `dist/`, pronta per il deploy su
Vercel, Netlify o qualsiasi host statico.
