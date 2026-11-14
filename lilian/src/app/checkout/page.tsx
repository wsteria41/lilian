'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { API } from '../lib/api'

const DISTRICTS = ['Баянзүрх', 'Сонгинохайрхан', 'Баянгол', 'Хан-Уул', 'Сүхбаатар', 'Чингэлтэй', 'Налайх', 'Багануур', 'Багахангай']

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [district, setDistrict] = useState(DISTRICTS[0])
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState<'cod' | 'transfer'>('cod')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState<number | null>(null)

  const shipping = totalPrice > 200000 ? 0 : 10000
  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-lily-border bg-lily-white text-sm text-lily-text placeholder:text-lily-muted focus:outline-none focus:border-lily-accent'
  const label = 'text-[10px] font-semibold tracking-widest uppercase text-lily-muted block mb-1.5'

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/auth')
  }, [router])

  const handleOrder = async () => {
    setError('')
    if (!address.trim()) return setError('Хаягаа дэлгэрэнгүй оруулна уу')
    if (!/^\d{8}$/.test(phone)) return setError('Утасны дугаар 8 оронтой байх ёстой')

    setLoading(true)
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: cart.map((i) => ({ product_id: i.productId, variant_id: i.variantId, quantity: i.quantity })),
          delivery_address: `${district} дүүрэг, ${address}`,
          phone,
          note,
          payment_method: payment,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Алдаа гарлаа')
      setOrderId(data.order.id)
      clearCart()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (orderId) {
    return (
      <div className="pt-16 min-h-screen bg-lily-blush flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-3xl p-10">
          <div className="w-20 h-20 rounded-full bg-lily-soft flex items-center justify-center mx-auto mb-5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C9184A" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-lily-text mb-2">Захиалга амжилттай!</h1>
          <p className="text-sm text-lily-muted mb-1">Захиалгын дугаар: #{orderId}</p>
          {payment === 'transfer' && (
            <p className="text-sm text-lily-rose mt-4 bg-lily-blush rounded-xl p-4">
              Дансаар шилжүүлэх бол гүйлгээний утга дээр <b>#{orderId}</b> гэж бичнэ үү.
            </p>
          )}
          <div className="flex gap-3 mt-8 justify-center">
            <Link href="/account" className="px-6 py-3 rounded-full border border-lily-border text-sm font-semibold text-lily-muted hover:text-lily-rose">
              Захиалгууд
            </Link>
            <Link href="/" className="px-6 py-3 rounded-full bg-lily-rose text-white text-sm font-semibold hover:bg-lily-deep">
              Дэлгүүрлэх
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return <div className="pt-16 min-h-screen flex items-center justify-center text-lily-muted">Сагс хоосон байна</div>
  }

  return (
    <div className="pt-16 min-h-screen bg-lily-blush">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-medium text-lily-text mb-8">Захиалга баталгаажуулах</h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-5">
            {/* Холбоо барих */}
            <div className="bg-white rounded-3xl p-7">
              <h2 className="font-display text-xl text-lily-text mb-5">1. Холбоо барих</h2>
              <label className={label}>Утасны дугаар</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={8}
                placeholder="99112233"
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            {/* Хаяг */}
            <div className="bg-white rounded-3xl p-7 space-y-4">
              <h2 className="font-display text-xl text-lily-text">2. Хүргэлтийн хаяг</h2>
              <div>
                <label className={label}>Дүүрэг</label>
                <select className={inputClass} value={district} onChange={(e) => setDistrict(e.target.value)}>
                  {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Хороо, байр, тоот</label>
                <textarea rows={2} className={inputClass + ' resize-none'} placeholder="3-р хороо, 12-р байр, 45 тоот"
                  value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className={label}>Нэмэлт тайлбар (заавал биш)</label>
                <input className={inputClass} placeholder="Хаалганы код, лавлах дугаар гэх мэт"
                  value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <p className="text-xs text-lily-muted">Улаанбаатар хотод 1–3 хоногт хүргэнэ.</p>
            </div>

            {/* Төлбөр */}
            <div className="bg-white rounded-3xl p-7">
              <h2 className="font-display text-xl text-lily-text mb-5">3. Төлбөр</h2>
              <div className="space-y-3">
                {([
                  ['cod', 'Хүргэлтээр бэлнээр', 'Бараагаа хүлээж авахдаа төлнө'],
                  ['transfer', 'Дансаар шилжүүлэх', 'Захиалгын дараа заасан дансанд шилжүүлнэ'],
                ] as const).map(([key, title, sub]) => (
                  <button
                    key={key}
                    onClick={() => setPayment(key)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      payment === key ? 'border-lily-rose bg-lily-blush/60' : 'border-lily-border hover:border-lily-pink'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === key ? 'border-lily-rose' : 'border-lily-border'}`}>
                      {payment === key && <span className="w-2.5 h-2.5 rounded-full bg-lily-rose" />}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-lily-text">{title}</span>
                      <span className="block text-xs text-lily-muted">{sub}</span>
                    </span>
                  </button>
                ))}
              </div>
              {payment === 'transfer' && (
                <div className="mt-4 text-sm bg-lily-blush rounded-xl p-4 text-lily-text">
                  {/* Өөрийн дансны мэдээллээр солино */}
                  Банк: <b>БАНКНЫ НЭР</b><br />
                  Данс: <b>ДАНСНЫ ДУГААР</b><br />
                  Хүлээн авагч: <b>НЭР</b>
                </div>
              )}
            </div>

            {error && <div className="px-4 py-3 rounded-xl text-sm bg-red-50 text-red-500">{error}</div>}

            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full bg-lily-rose text-white font-semibold text-sm py-4 rounded-2xl hover:bg-lily-deep disabled:opacity-60"
            >
              {loading ? 'Түр хүлээнэ үү...' : `Захиалга өгөх · ${(totalPrice + shipping).toLocaleString()}₮`}
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl p-6 lg:sticky lg:top-24">
            <h3 className="font-display text-lg text-lily-text mb-4">Таны захиалга</h3>
            <div className="space-y-3 mb-4">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-lily-blush shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-lily-text truncate">{item.name}</p>
                    <p className="text-[11px] text-lily-muted">{item.color} · {item.size} · ×{item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold">{(item.price * item.quantity).toLocaleString()}₮</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-lily-border mb-3" />
            <div className="flex justify-between text-sm mb-1">
              <span className="text-lily-muted">Хүргэлт</span>
              <span>{shipping === 0 ? 'Үнэгүй' : `${shipping.toLocaleString()}₮`}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Нийт</span>
              <span className="text-lily-rose">{(totalPrice + shipping).toLocaleString()}₮</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}