'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cart, updateQty, removeFromCart, totalPrice } = useCart()
  const router = useRouter()

  const shipping = totalPrice > 200000 ? 0 : 10000

  return (
    <div className="pt-16 min-h-screen bg-lily-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-medium text-lily-text mb-2">Таны сагс</h1>
        <p className="text-lily-muted text-sm mb-10">
          {cart.length === 0 ? 'Сагс хоосон байна.' : `${cart.length} бүтээгдэхүүн`}
        </p>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-lily-blush flex items-center justify-center mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFB3D1" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h2 className="font-display text-2xl text-lily-text mb-2">Сагс хоосон байна</h2>
            <p className="text-lily-muted text-sm mb-8">Манай цуглуулгыг үзээрэй</p>
            <Link href="/" className="bg-lily-text text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-lily-rose">
              Дэлгүүр хэсэх
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-5 bg-lily-blush rounded-2xl p-4">
                  <div className="w-24 h-28 rounded-xl overflow-hidden bg-lily-soft flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-lily-pink/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base font-medium text-lily-text">{item.name}</h3>
                        <p className="text-xs text-lily-muted mt-0.5">
                          {item.color} · {item.size}
                        </p>
                      </div>
                      <span className="font-semibold text-lily-text text-sm whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString()}₮
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 border border-lily-border rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQty(i, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-lily-muted hover:text-lily-rose text-lg"
                        >−</button>
                        <span className="w-8 text-center text-sm font-semibold text-lily-text">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(i, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-lily-muted hover:text-lily-rose text-lg"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(i)}
                        className="text-xs text-lily-muted hover:text-lily-rose"
                      >
                        Хасах
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-lily-blush rounded-2xl p-6 sticky top-24">
                <h2 className="font-display text-xl font-medium text-lily-text mb-6">Захиалгын дүн</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-lily-muted">Нийт бараа</span>
                    <span className="font-medium text-lily-text">{totalPrice.toLocaleString()}₮</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lily-muted">Хүргэлт</span>
                    <span className="font-medium text-lily-text">
                      {shipping === 0 ? 'Үнэгүй' : `${shipping.toLocaleString()}₮`}
                    </span>
                  </div>
                  {totalPrice <= 200000 && (
                    <p className="text-[11px] text-lily-accent">
                      {(200000 - totalPrice).toLocaleString()}₮ нэмж авбал хүргэлт үнэгүй
                    </p>
                  )}
                  <div className="w-full h-px bg-lily-border" />
                  <div className="flex justify-between font-semibold text-base">
                    <span className="text-lily-text">Нийт дүн</span>
                    <span className="text-lily-rose">{(totalPrice + shipping).toLocaleString()}₮</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full mt-5 bg-lily-rose text-white font-semibold text-sm py-4 rounded-2xl hover:bg-lily-deep tracking-wide"
                >
                  Захиалга өгөх
                </button>
                <Link
                  href="/"
                  className="w-full mt-2 text-center text-sm text-lily-muted hover:text-lily-rose py-2 block"
                >
                  ← Дэлгүүр хэсэх
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>  
  )
}