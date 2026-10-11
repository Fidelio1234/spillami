// @ts-nocheck
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const MERCHANT_EMAIL = 'smartshop2026@libero.it'

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const customerEmail = session.customer_details?.email ?? null
    const shipping = session.shipping_details
    const shippingName = shipping?.name ?? null
    const shippingAddress = shipping?.address?.line1 ?? null
    const shippingCity = shipping?.address?.city ?? null
    const shippingZip = shipping?.address?.postal_code ?? null

    // Recupera i prodotti acquistati
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    })

    // Salva l'ordine nel database
    const { error: dbError } = await supabase.from('orders').insert({
      stripe_session_id: session.id,
      customer_email: customerEmail,
      amount_total: (session.amount_total ?? 0) / 100,
      status: 'paid',
      shipping_name: shippingName,
      shipping_address: shippingAddress,
      shipping_city: shippingCity,
      shipping_zip: shippingZip,
    })

    if (dbError) {
      console.error('DB error:', dbError)
    }

    // ── Costruisce e invia l'email al merchant ──────────────────
    const itemsHtml = lineItems.data
      .map(
        (item) =>
          `<tr>
            <td style="padding:6px 12px;border-bottom:1px solid #eee">${item.description}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">€${((item.amount_total ?? 0) / 100).toFixed(2)}</td>
          </tr>`,
      )
      .join('')

    const totalFormatted = `€${((session.amount_total ?? 0) / 100).toFixed(2)}`

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#8B4513;border-bottom:2px solid #8B4513;padding-bottom:8px">
          🛍️ Nuovo ordine ricevuto — Smart-Shop.it
        </h2>

        <h3 style="color:#555">📦 Dati di spedizione</h3>
        <table style="border-collapse:collapse;width:100%;background:#f9f9f9;border-radius:8px">
          <tr><td style="padding:8px 12px;font-weight:bold;width:140px">Nome</td><td style="padding:8px 12px">${shippingName ?? '—'}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold">Indirizzo</td><td style="padding:8px 12px">${shippingAddress ?? '—'}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold">Città</td><td style="padding:8px 12px">${shippingCity ?? '—'}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold">CAP</td><td style="padding:8px 12px">${shippingZip ?? '—'}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold">Email cliente</td><td style="padding:8px 12px">${customerEmail ?? '—'}</td></tr>
        </table>

        <h3 style="color:#555;margin-top:24px">🛒 Prodotti ordinati</h3>
        <table style="border-collapse:collapse;width:100%">
          <thead>
            <tr style="background:#8B4513;color:white">
              <th style="padding:8px 12px;text-align:left">Prodotto</th>
              <th style="padding:8px 12px;text-align:center">Qtà</th>
              <th style="padding:8px 12px;text-align:right">Prezzo</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="margin-top:16px;padding:12px 16px;background:#FFF3E0;border-radius:8px;font-size:18px;font-weight:bold;color:#8B4513">
          Totale: ${totalFormatted}
        </div>

        <p style="color:#888;font-size:12px;margin-top:24px">
          ID sessione Stripe: ${session.id}
        </p>
      </div>
    `

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Smart-Shop.it <onboarding@resend.dev>',
          to: MERCHANT_EMAIL,
          subject: `🛍️ Nuovo ordine — ${totalFormatted} — ${shippingName ?? customerEmail ?? 'Ospite'}`,
          html: emailHtml,
        }),
      })
    } catch (err) {
      console.error('Email error:', err)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})