'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLogin({ params }: { params: { lang: string } }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah.')
      setLoading(false)
    } else {
      router.push(`/${params.lang}/admin`)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-xl p-10 shadow-sm">
        <h1 className="font-[Noto_Serif] text-3xl font-bold text-[#2b3437] mb-2">Beautifulnesia</h1>
        <p className="text-sm text-[#586064] mb-8">Admin Login</p>

        {error && <p className="text-red-500 text-sm mb-6">{error}</p>}

        <div className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-[#586064] font-bold block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-[#abb3b7] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#506072]"
              placeholder="admin@email.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[#586064] font-bold block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full border border-[#abb3b7] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#506072]"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#506072] text-white py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#445465] transition-colors disabled:opacity-50"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </div>
      </div>
    </main>
  )
}