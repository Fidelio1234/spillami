// supabase/functions/stripe-webhook/index.ts
// Riceve gli eventi da Stripe e salva l'ordine nel database

import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  const body = await req.text()

  let event: Stripe.Event

  try {
    if (!signature || !webhookSecret) {
      throw new Error('Firma webhook mancante')
    }
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Gestiamo solo il pagamento completato
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const items = JSON.parse(session.metadata?.items ?? '[]')
      const customerEmail = session.metadata?.customer_email ?? session.customer_email
      const total = (session.amount_total ?? 0) / 100

      // Shipping dalla sessione Stripe
      const shipping = session.shipping_details

      // Trova l'utente tramite email
      const { data: userData } = await supabase.auth.admin.listUsers()
      const user = userData?.users?.find((u) => u.email === customerEmail)

      // Crea l'ordine
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id ?? null,
          status: 'paid',
          total,
          shipping_name: shipping?.name ?? '',
          shipping_address: shipping?.address?.line1 ?? '',
          shipping_city: shipping?.address?.city ?? '',
          shipping_zip: shipping?.address?.postal_code ?? '',
          stripe_session_id: session.id,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Crea le righe ordine e aggiorna lo stock
      for (const item of items) {
        // Inserisce riga ordine
        const { data: product } = await supabase
          .from('products')
          .select('name, price')
          .eq('id', item.id)
          .single()

        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: item.id,
          product_name: product?.name ?? 'Prodotto',
          quantity: item.quantity,
          price_at_purchase: item.price,
        })

        // Decrementa stock
        await supabase.rpc('decrement_stock', {
          product_id: item.id,
          quantity: item.quantity,
        })
      }

      console.log(`✓ Ordine ${order.id} creato per ${customerEmail}`)
    } catch (err) {
      console.error('Errore creazione ordine:', err)
      return new Response(`Errore: ${err.message}`, { status: 500 })
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
