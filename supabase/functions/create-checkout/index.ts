// supabase/functions/create-checkout/index.ts
// Crea una sessione Stripe Checkout e ritorna l'URL

import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Gestione preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items, customerEmail, shippingData } = await req.json()

    if (!items || items.length === 0) {
      throw new Error('Carrello vuoto')
    }

    // Costruisce i line_items per Stripe
    const lineItems = items.map((item: {
      name: string
      price: number
      quantity: number
      images?: string[]
    }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.images?.filter(Boolean).slice(0, 1) ?? [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe vuole i centesimi
      },
      quantity: item.quantity,
    }))

    // URL base del sito (in produzione usa il dominio reale)
    const origin = req.headers.get('origin') ?? 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail ?? undefined,
      shipping_address_collection: {
        allowed_countries: ['IT', 'DE', 'FR', 'ES', 'AT', 'BE', 'NL'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'Spedizione standard gratuita',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 4 },
            },
          },
        },
      ],
      metadata: {
        // Salviamo i dati ordine per il webhook
        items: JSON.stringify(items.map((i: { id: string; quantity: number; price: number }) => ({
          id: i.id,
          quantity: i.quantity,
          price: i.price,
        }))),
        customer_email: customerEmail ?? '',
      },
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    })

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
