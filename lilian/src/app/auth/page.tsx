'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API } from '../lib/api'

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })

  const inputClass =
    'w-full px-4 py-3.5 rounded-xl border border-lily-border bg-lily-blush/40 text-sm text-lily-text placeholder:text-lily-muted focus:outline-none focus:border-lily-accent focus:bg-white focus:ring-2 focus:ring-lily-pink/30 transition-all'
  const labelClass = 'text-[10px] font-semibold tracking-widest uppercase text-lily-muted block mb-1.5'

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTab('login')
      setLoginData({ email: registerData.email, password: '' })
      setError('Бүртгэл амжилттай! Нэвтэрнэ үү.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const memberPerks = [
    'Early access to new collections',
    'Exclusive member-only discounts',
    'Free express shipping on all orders',
    'Save your wishlist & order history',
    'Birthday gift & surprise rewards',
  ]

  const eyeIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  return (
    <div className="pt-16 min-h-screen bg-lily-blush">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col relative overflow-hidden bg-lily-text">
          <img
            src="https://images.unsplash.com/photo-1690692837567-6d911da8b292?w=900&h=1200&fit=crop&auto=format"
            alt="Elegant pink flowers"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-lily-text/80 via-lily-rose/30 to-lily-text/60" />
          <div className="relative z-10 flex flex-col h-full p-12">
            <button
              onClick={() => router.push('/')}
              className="font-display text-2xl font-semibold tracking-widest text-white/90 hover:text-white self-start"
            >
              LILIAN
            </button>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-lily-pink text-xs font-semibold tracking-[0.3em] uppercase mb-4">
                {tab === 'login' ? 'Welcome back' : 'Join the Garden'}
              </p>
              <h2 className="font-display text-4xl font-medium text-white leading-tight mb-6">
                {tab === 'login' ? (
                  <>Your elegance<br /><em className="italic text-lily-pink">awaits</em></>
                ) : (
                  <>Become part of<br /><em className="italic text-lily-pink">something beautiful</em></>
                )}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs">
                {tab === 'login'
                  ? 'Sign in to access your orders, wishlist, and exclusive member perks.'
                  : 'Create your account and unlock a world of carefully curated fashion.'}
              </p>
              <div className="space-y-3">
                {memberPerks.map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="text-lily-pink text-xs">✦</span>
                    <span className="text-white/75 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="relative overflow-hidden flex items-center justify-center px-6 py-12 bg-gradient-to-br from-lily-blush via-lily-soft/60 to-lily-pink/50">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-lily-pink/40 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 w-96 h-96 rounded-full bg-lily-accent/30 blur-3xl" />
          <div className="absolute top-1/4 left-8 w-40 h-40 rounded-full border border-lily-accent/30" />
          <div className="absolute bottom-16 right-10 w-56 h-56 rounded-full border border-lily-accent/20" />

          {/* Card */}
          <div className="relative w-full max-w-md bg-white rounded-[2rem] border border-lily-pink/60 shadow-xl shadow-lily-rose/10 p-8 md:p-10">
            <div className="text-center mb-7">
              <p className="font-display text-2xl font-semibold tracking-widest text-lily-text lg:hidden mb-1">LILIAN</p>
              <h1 className="font-display text-2xl text-lily-text">
                {tab === 'login' ? 'Тавтай морил' : 'Бүртгэл үүсгэх'}
              </h1>
              <p className="text-xs text-lily-muted mt-1">
                {tab === 'login' ? 'Бүртгэлээрээ нэвтэрнэ үү' : 'Хэдхэн секундэд бүртгүүлээрэй'}
              </p>
            </div>

            {/* Tab toggle */}
            <div className="flex rounded-2xl bg-lily-blush p-1 mb-6 border border-lily-border">
              {(['login', 'register'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError('') }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    tab === t ? 'bg-white text-lily-rose shadow-sm' : 'text-lily-muted hover:text-lily-text'
                  }`}
                >
                  {t === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
                </button>
              ))}
            </div>

            {error && (
              <div
                className={`mb-4 px-4 py-3 rounded-xl text-sm ${
                  error.includes('амжилттай') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}
              >
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>И-мэйл</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className={inputClass}
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Нууц үг</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Нууц үгээ оруулна уу"
                      className={inputClass + ' pr-11'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lily-muted hover:text-lily-rose"
                    >
                      {eyeIcon}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-lily-rose text-white font-semibold text-sm py-4 rounded-2xl hover:bg-lily-deep tracking-wide shadow-md shadow-lily-rose/20 disabled:opacity-60"
                >
                  {loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Нэр</label>
                  <input
                    type="text"
                    placeholder="Таны нэр"
                    className={inputClass}
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>И-мэйл</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className={inputClass}
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Нууц үг</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="8+ тэмдэгт"
                      className={inputClass + ' pr-11'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lily-muted hover:text-lily-rose"
                    >
                      {eyeIcon}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-lily-rose text-white font-semibold text-sm py-4 rounded-2xl hover:bg-lily-deep tracking-wide shadow-md shadow-lily-rose/20 disabled:opacity-60"
                >
                  {loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх'}
                </button>
              </div>
            )}

            <p className="text-center text-xs text-lily-muted mt-6">
              {tab === 'login' ? 'Бүртгэлгүй юу? ' : 'Бүртгэлтэй юу? '}
              <button
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}
                className="text-lily-rose hover:underline font-semibold"
              >
                {tab === 'login' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}