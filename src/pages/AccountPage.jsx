import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import styles from './AccountPage.module.css'

const fmt = (n) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)

const fmtDate = (d) =>
  new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(d))

const STATUS_LABEL = {
  pending:   { label: 'In attesa',  color: 'amber' },
  paid:      { label: 'Pagato',     color: 'green' },
  shipped:   { label: 'Spedito',    color: 'blue'  },
  delivered: { label: 'Consegnato', color: 'sage'  },
  cancelled: { label: 'Annullato',  color: 'red'   },
}

function useOrders(userId) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!userId) return
    supabase.from('orders').select('*, order_items(*)').eq('user_id', userId).order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false) })
  }, [userId])
  return { orders, loading }
}

function ProfileTab({ user, profile }) {
  const [form, setForm] = useState({ full_name: profile?.full_name || '', address: profile?.address || '', phone: profile?.phone || '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    const { error } = await supabase.from('profiles').update({ full_name: form.full_name.trim(), address: form.address.trim(), phone: form.phone.trim() }).eq('id', user.id)
    setSaving(false)
    if (error) { setError(error.message); return }
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Dati personali</h2>
      <form className={styles.profileForm} onSubmit={handleSave}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input className={`${styles.input} ${styles.inputDisabled}`} type="email" value={user.email} disabled />
          <p className={styles.fieldNote}>L'email non può essere modificata</p>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Nome completo</label>
          <input className={styles.input} type="text" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Mario Rossi" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Indirizzo di spedizione</label>
          <input className={styles.input} type="text" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Via Roma 1, 20100 Milano" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Telefono</label>
          <input className={styles.input} type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+39 333 000 0000" />
        </div>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <button type="submit" className={`btn btn-dark ${saved ? styles.savedBtn : ''}`} disabled={saving}>
          {saved ? '✓ Salvato!' : saving ? 'Salvataggio...' : 'Salva modifiche'}
        </button>
      </form>
    </div>
  )
}

function OrdersTab({ userId }) {
  const { orders, loading } = useOrders(userId)
  const [expanded, setExpanded] = useState(null)
  if (loading) return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>I miei ordini</h2>
      <div className={styles.loadingOrders}>{Array(3).fill(0).map((_, i) => <div key={i} className={styles.skeletonOrder} />)}</div>
    </div>
  )
  if (orders.length === 0) return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>I miei ordini</h2>
      <div className={styles.emptyOrders}>
        <span className={styles.emptyIcon}>📦</span>
        <p>Nessun ordine ancora</p>
        <Link to="/shop" className="btn btn-dark">Vai allo shop</Link>
      </div>
    </div>
  )
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>I miei ordini ({orders.length})</h2>
      <div className={styles.ordersList}>
        {orders.map((order) => {
          const status = STATUS_LABEL[order.status] || STATUS_LABEL.pending
          const isOpen = expanded === order.id
          return (
            <div key={order.id} className={styles.orderCard}>
              <button className={styles.orderHeader} onClick={() => setExpanded(isOpen ? null : order.id)}>
                <div className={styles.orderHeaderLeft}>
                  <span className={styles.orderDate}>{fmtDate(order.created_at)}</span>
                  <span className={styles.orderRef}>#{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className={styles.orderHeaderRight}>
                  <span className={`${styles.statusBadge} ${styles['status_' + status.color]}`}>{status.label}</span>
                  <span className={styles.orderTotal}>{fmt(order.total)}</span>
                  <span className={styles.orderChevron}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>
              {isOpen && (
                <div className={styles.orderDetail}>
                  <div className={styles.orderItems}>
                    {order.order_items?.map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <div className={styles.orderItemInfo}>
                          <p className={styles.orderItemName}>{item.product_name}</p>
                          <p className={styles.orderItemQty}>Quantità: {item.quantity}</p>
                        </div>
                        <span className={styles.orderItemPrice}>{fmt(item.price_at_purchase * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  {order.shipping_address && (
                    <div className={styles.orderShipping}>
                      <p className={styles.orderShippingTitle}>Spedizione a</p>
                      <p className={styles.orderShippingAddr}>{order.shipping_name}<br />{order.shipping_address}, {order.shipping_zip} {order.shipping_city}</p>
                    </div>
                  )}
                  <div className={styles.orderTotalRow}><span>Totale pagato</span><span>{fmt(order.total)}</span></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AccountPage() {
  const { user, profile, signOut, loading } = useAuthStore()
  const [tab, setTab] = useState('orders')
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase()
  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <p className={styles.userName}>{profile?.full_name || 'Il mio account'}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <nav className={styles.sideNav}>
            <button className={`${styles.navBtn} ${tab === 'orders' ? styles.navBtnActive : ''}`} onClick={() => setTab('orders')}>
              <span>📦</span> I miei ordini
            </button>
            <button className={`${styles.navBtn} ${tab === 'profile' ? styles.navBtnActive : ''}`} onClick={() => setTab('profile')}>
              <span>👤</span> Dati personali
            </button>
          </nav>
          <button className={styles.logoutBtn} onClick={signOut}>Esci dall'account</button>
        </aside>
        <div className={styles.main}>
          {tab === 'orders' && <OrdersTab userId={user.id} />}
          {tab === 'profile' && <ProfileTab user={user} profile={profile} />}
        </div>
      </div>
    </main>
  )
}
