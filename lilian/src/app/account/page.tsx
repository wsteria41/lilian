'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API } from '../lib/api'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Order {
  id: number
  total_price: string
  status: string
  created_at: string
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Хүлээгдэж байна', cls: 'bg-amber-50 text-amber-600' },
  preparing: { label: 'Бэлдэж байна', cls: 'bg-lily-soft text-lily-rose' },
  shipping: { label: 'Хүргэж байна', cls: 'bg-blue-50 text-blue-600' },
  delivered: { label: 'Хүргэгдсэн', cls: 'bg-green-50 text-green-600' },
  cancelled: { label: 'Цуцлагдсан', cls: 'bg-gray-100 text-gray-500' },
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const saved = localStorage.getItem('user')
    if (!token || !saved) {
      router.push('/auth')
      return
    }
    try {
      setUser(JSON.parse(saved))
    } catch {
      router.push('/auth')
      return
    }

    fetch(`${API}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          logout()
          return []
        }
        return res.json()
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) return null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Өглөөний мэнд' : hour < 18 ? 'Өдрийн мэнд' : 'Оройн мэнд'

  return (
    <div className="pt-16 min-h-screen bg-lily-blush">
      {/* Hero header */}
      <div className="relative z-0 overflow-hidden bg-gradient-to-br from-[#3d0f20] via-[#5a1a2e] to-[#8b2a4a]">
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full border border-white/10" />
        <div className="absolute -top-10 right-24 w-52 h-52 rounded-full border border-white/10" />
        <div className="absolute top-10 right-1/3 w-64 h-64 rounded-full bg-lily-accent/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 pt-10 pb-20">
          <h1 className="font-display text-3xl md:text-4xl font-medium text-white leading-tight">
            {greeting}, <em className="italic text-lily-pink">{user.name}</em>
          </h1>
          <p className="text-white/60 text-sm mt-2">Таны LILIAN-ы ертөнцөд тавтай морил.</p>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 -mt-10 pb-16 grid md:grid-cols-3 gap-6 items-start">
        {/* Profile */}
        <div className="bg-white rounded-3xl p-7 shadow-sm md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lily-pink to-lily-rose text-white flex items-center justify-center text-3xl font-display font-semibold shadow-md shadow-lily-rose/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="font-display text-xl text-lily-text mt-4">{user.name}</p>
            <p className="text-sm text-lily-muted">{user.email}</p>
            {user.role === 'admin' && (
              <span className="mt-3 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-lily-soft text-lily-rose">
                Админ
              </span>
            )}
          </div>

          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="block text-center mt-6 bg-lily-text text-white text-sm font-semibold py-3 rounded-2xl hover:bg-lily-rose transition-colors"
            >
              Админ самбар
            </Link>
          )}

          <button
            onClick={logout}
            className="w-full mt-3 border border-lily-border text-lily-muted text-sm font-semibold py-3 rounded-2xl hover:border-lily-rose hover:text-lily-rose transition-colors"
          >
            Гарах
          </button>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-3xl p-7 shadow-sm md:col-span-2">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-lily-muted text-[10px] font-semibold tracking-[0.25em] uppercase mb-1">
                Түүх
              </p>
              <h2 className="font-display text-2xl text-lily-text">Миний захиалгууд</h2>
            </div>
            <span className="text-xs text-lily-muted">{orders.length} захиалга</span>
          </div>

          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 border-2 border-lily-rose border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lily-muted text-sm mb-5">Одоогоор захиалга байхгүй байна.</p>
              <Link
                href="/"
                className="inline-block bg-lily-rose text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-lily-deep"
              >
                Дэлгүүр хэсэх
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const s = STATUS[o.status] ?? { label: o.status, cls: 'bg-gray-100 text-gray-500' }
                return (
                  <div
                    key={o.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-lily-blush/60 border border-lily-border"
                  >
                    <div>
                      <p className="text-sm font-semibold text-lily-text">Захиалга #{o.id}</p>
                      <p className="text-xs text-lily-muted mt-0.5">
                        {new Date(o.created_at).toLocaleDateString('en-CA')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${s.cls}`}>
                        {s.label}
                      </span>
                      <span className="text-sm font-semibold text-lily-rose whitespace-nowrap">
                        {Number(o.total_price).toLocaleString()}₮
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}