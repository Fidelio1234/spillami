import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Il carrello persiste in localStorage automaticamente
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Aggiunge un prodotto o incrementa la quantità
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find((i) => i.id === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },

      // Rimuove completamente un prodotto
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) })
      },

      // Cambia la quantità (se arriva a 0, rimuove)
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          ),
        })
      },

      // Svuota il carrello
      clearCart: () => set({ items: [] }),

      // Totale articoli (somma quantità)
      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      // Totale prezzo
      get totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    {
      name: 'spillami-cart',
    }
  )
)
