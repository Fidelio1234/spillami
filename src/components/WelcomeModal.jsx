import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

// Posizione, inclinazione e ritmo di fluttuazione di ogni prodotto
const SLOTS = [
  { left: '4%',  top: '20%', rot: -8, delay: 0.0, float: 5.2, size: 1 },
  { left: '22%', top: '54%', rot: 6,  delay: 0.12, float: 6.1, size: 0.92 },
  { left: '39%', top: '6%',  rot: -3, delay: 0.24, float: 5.6, size: 1.15 },
  { left: '60%', top: '52%', rot: 9,  delay: 0.36, float: 6.4, size: 0.95 },
  { left: '77%', top: '14%', rot: -6, delay: 0.48, float: 5.0, size: 1 },
]

export default function WelcomeModal() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [tick, setTick] = useState(0)

  // Mostra il popup una sola volta per sessione
  useEffect(() => {
    try {
      if (!sessionStorage.getItem('welcomeSeen')) setOpen(true)
    } catch {
      setOpen(true)
    }
  }, [])

  // Carica fino a 5 prodotti attivi con foto, scelti a caso
  useEffect(() => {
    if (!open) return
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, images')
        .eq('active', true)
        .limit(40)
      if (cancelled || !data) return
      const pool = data
      .filter((p) => p.images?.length)
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)
    pool.forEach((p) => {
      const im = new Image()
      im.src = p.images[0] // precarica le foto, così non lampeggiano al cambio
    })
    setProducts(pool)
    })()
    return () => {
      cancelled = true
    }
  }, [open])


  useEffect(() => {
    if (!open || products.length <= SLOTS.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((t) => t + 1), 2500)
    return () => clearInterval(id)
  }, [open, products.length])



  const close = () => {
    try {
      sessionStorage.setItem('welcomeSeen', '1')
    } catch {}
    setOpen(false)
  }

  // Chiusura con tasto Esc e blocco dello scroll dietro al popup
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const goShop = () => {
    close()
    navigate('/shop')
  }

  return (
    <div className="wm-overlay" onClick={close} role="dialog" aria-modal="true" aria-label="Benvenuto">
      <style>{css}</style>

      <div className="wm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="wm-close" onClick={close} aria-label="Chiudi">
          ✕
        </button>

        {/* Palcoscenico con i prodotti che fluttuano */}
        <div className="wm-stage">
          <span className="wm-blob wm-blob1" />
          <span className="wm-blob wm-blob2" />

          
          {SLOTS.slice(0, products.length).map((s, i) => {
  const p = products[(tick * SLOTS.length + i) % products.length]
  return (
    <div
      key={i}
      className="wm-item"
      style={{
        left: s.left,
        top: s.top,
        '--rot': `${s.rot}deg`,
        '--delay': `${s.delay}s`,
        '--float': `${s.float}s`,
        '--size': s.size,
      }}
    >
      <div className="wm-float">
        <div key={p.id} className="wm-swap">
          <div className="wm-card">
            <img src={p.images[0]} alt={p.name} loading="eager" />
          </div>
          <span className="wm-price">{fmt(p.price)}</span>
        </div>
      </div>
    </div>
  )
})}
        </div>





        {/* Testo */}
        <div className="wm-body">
          <span className="wm-eyebrow">Benvenuto</span>
          <h2 className="wm-title">
            Benvenuto su <em>smart-shop</em>
          </h2>
          <div className="wm-line" />
          <p className="wm-text">
            La spedizione è sempre <strong>inclusa nel prezzo</strong>.
            <br />
            Quello che vedi è quello che paghi.
          </p>
          <div className="wm-actions">
            <button className="wm-btn wm-btn-main" onClick={goShop}>
              Scopri i prodotti
            </button>
            <button className="wm-btn wm-btn-ghost" onClick={close}>
              Continua a navigare
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const css = `
.wm-overlay{
  position:fixed; inset:0; z-index:10000;
  background:rgba(30,24,18,.62); backdrop-filter:blur(6px);
  display:flex; align-items:center; justify-content:center;
  padding:16px; animation:wmFade .35s ease both;
}
.wm-modal{
  position:relative; width:100%; max-width:780px; max-height:94vh; overflow:hidden;
  background:#F8F4ED; border-radius:28px;
  box-shadow:0 40px 90px rgba(30,24,18,.45);
  animation:wmPop .6s cubic-bezier(.2,.9,.25,1.1) both;
}
.wm-close{
  position:absolute; top:14px; right:14px; z-index:5;
  width:38px; height:38px; border-radius:50%; border:none; cursor:pointer;
  background:rgba(255,255,255,.85); color:#3A2B23; font-size:15px;
  transition:transform .2s, background .2s;
}
.wm-close:hover{ transform:rotate(90deg); background:#fff; }

/* Palcoscenico */
.wm-stage{
  position:relative; height:300px; overflow:hidden;
  background:linear-gradient(135deg,#F2E3D0 0%,#EBD2B8 100%);
}
.wm-blob{ position:absolute; border-radius:50%; filter:blur(30px); opacity:.55; }
.wm-blob1{ width:240px; height:240px; background:#E8A77C; left:-60px; top:-70px; animation:wmDrift 9s ease-in-out infinite alternate; }
.wm-blob2{ width:220px; height:220px; background:#B9C4A8; right:-50px; bottom:-80px; animation:wmDrift 11s ease-in-out infinite alternate-reverse; }

.wm-item{
  position:absolute; width:calc(140px * var(--size));
  transform:rotate(var(--rot));
  animation:wmEnter .7s cubic-bezier(.2,.9,.3,1.2) both;
  animation-delay:calc(.35s + var(--delay));
}
.wm-float{
  display:flex; flex-direction:column; align-items:center; gap:8px;
  animation:wmFloat var(--float) ease-in-out infinite;
  animation-delay:var(--delay);
}
.wm-card{
  width:100%; aspect-ratio:1/1; border-radius:20px; overflow:hidden;
  background:#fff; border:4px solid #fff;
  box-shadow:0 18px 30px rgba(120,70,30,.25);
}
.wm-card img{ width:100%; height:100%; object-fit:cover; display:block; }
.wm-price{
  background:#C86B3C; color:#fff; font-size:12px; font-weight:600;
  padding:4px 12px; border-radius:999px; box-shadow:0 6px 12px rgba(162,73,31,.3);
}

.wm-swap{
  display:flex; flex-direction:column; align-items:center; gap:8px; width:100%;
  animation:wmSwap .5s ease both;
}
@keyframes wmSwap{ from{opacity:0; transform:scale(.85)} to{opacity:1; transform:none} }

/* Testo */
.wm-body{ padding:30px 28px 34px; text-align:center; }
.wm-eyebrow{
  display:inline-block; font-size:12px; letter-spacing:3px; text-transform:uppercase;
  color:#8A9A7B; font-weight:600; margin-bottom:10px;
}
.wm-title{
  font-family:'Playfair Display',Georgia,serif; font-weight:500;
  font-size:clamp(28px,5vw,42px); line-height:1.15; color:#1E1C18; margin:0;
}
.wm-title em{ font-style:italic; color:#C86B3C; }
.wm-line{ width:48px; height:2px; background:#C86B3C; border-radius:2px; margin:16px auto; }
.wm-text{ font-size:16px; line-height:1.7; color:#6B6660; margin:0 0 24px; }
.wm-text strong{ color:#C86B3C; }
.wm-actions{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.wm-btn{
  border:none; cursor:pointer; font-size:15px; font-weight:600; font-family:inherit;
  padding:14px 28px; border-radius:999px; transition:transform .2s, box-shadow .2s, background .2s;
}
.wm-btn-main{ background:#C86B3C; color:#fff; box-shadow:0 10px 22px rgba(162,73,31,.32); }
.wm-btn-main:hover{ transform:translateY(-2px); box-shadow:0 14px 26px rgba(162,73,31,.4); }
.wm-btn-ghost{ background:transparent; color:#6B6660; }
.wm-btn-ghost:hover{ color:#1E1C18; }

@keyframes wmFade{ from{opacity:0} to{opacity:1} }
@keyframes wmPop{ from{opacity:0; transform:scale(.85) translateY(24px)} to{opacity:1; transform:none} }
@keyframes wmEnter{ from{opacity:0; transform:rotate(var(--rot)) translateY(40px) scale(.6)} to{opacity:1; transform:rotate(var(--rot))} }
@keyframes wmFloat{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
@keyframes wmDrift{ from{transform:translate(0,0)} to{transform:translate(40px,30px)} }

@media (max-width:600px){
  .wm-stage{ height:230px; }
  .wm-item{ width:calc(96px * var(--size)); }
  .wm-card{ border-radius:14px; border-width:3px; }
  .wm-price{ font-size:11px; padding:3px 9px; }
  .wm-body{ padding:22px 20px 26px; }
  .wm-btn{ width:100%; }
}

@media (prefers-reduced-motion:reduce){
  .wm-overlay,.wm-modal,.wm-item,.wm-float,.wm-blob{ animation:none !important; }
}
`