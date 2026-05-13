'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminLogin() {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password wajib diisi.')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email atau password salah. Coba lagi.')
      setLoading(false)
    } else {
      router.push(`/${lang}/admin`)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#f8f9fa]">
      <div className="w-full max-w-md bg-white rounded-xl p-10 shadow-sm border border-[#dbe4e7]">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[Noto_Serif] text-3xl font-bold text-[#2b3437] mb-1">
            Beautifulnesia
          </h1>
          <p className="text-sm text-[#586064]">Admin Login</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-widest text-[#586064] font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className="w-full border border-[#abb3b7] rounded-lg px-4 py-3 text-sm text-[#2b3437] bg-white focus:outline-none focus:border-[#506072] focus:ring-1 focus:ring-[#506072] transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-widest text-[#586064] font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full border border-[#abb3b7] rounded-lg px-4 py-3 text-sm text-[#2b3437] bg-white focus:outline-none focus:border-[#506072] focus:ring-1 focus:ring-[#506072] transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#506072] text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#445465] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

        </div>
      </div>
    </main>
  )
}