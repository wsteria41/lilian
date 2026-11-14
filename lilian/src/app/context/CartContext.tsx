'use client'

import { createContext, useContext, useState, useEffect} from 'react'

export interface CartItem {
  productId: number
  variantId: number
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  updateQty: (index: number, qty: number) => void
  clearCart: () => void
  cartCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
 const [loaded, setLoaded] = useState(false)

 

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.findIndex(
        c => c.productId === item.productId && c.variantId === item.variantId
      )
      if (existing >= 0) {
        return prev.map((c, i) => i === existing ? { ...c, quantity: c.quantity + item.quantity } : c)
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const updateQty = (index: number, qty: number) => {
    if (qty < 1) {
      removeFromCart(index)
    } else {
      setCart(prev => prev.map((c, i) => i === index ? { ...c, quantity: qty } : c))
    }
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}