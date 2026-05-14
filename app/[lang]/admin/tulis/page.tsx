'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

export default function TulisArtikel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const lang = params.lang as string
  const editId = searchParams.get('id')

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    judul_id: '',
    judul_en: '',
    slug: '',
    deskripsi_id: '',
    deskripsi_en: '',
    konten_id: '',
    konten_en: '',
    gambar_url: '',
    kategori: 'Destinasi',
    published: true,
  })

  // Buat supabase client langsung di sini agar auth session terbaca
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Load data jika mode edit
  useEffect(() => {
    if (!editId) return
    setLoadingData(true)
    supabase
      .from('artikel')
      .select('*')
      .eq('id', editId)
      .single()
      .then(({ data }) => {
        if (data) setForm(data)
        setLoadingData(false)
      })
  }, [editId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'judul_id') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '')
      setForm(prev => ({ ...prev, judul_id: value, slug }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async (published: boolean) => {
    // Validasi
    if (!form.judul_id || !form.judul_en) {
      setErrorMsg('Judul Indonesia dan Inggris wajib diisi.')
      return
    }
    if (!form.slug) {
      setErrorMsg('Slug wajib diisi.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    const payload = {
      judul_id: form.judul_id,
      judul_en: form.judul_en,
      slug: form.slug,
      deskripsi_id: form.deskripsi_id,
      deskripsi_en: form.deskripsi_en,
      konten_id: form.konten_id,
      konten_en: form.konten_en,
      gambar_url: form.gambar_url,
      kategori: form.kategori,
      published,
    }

    let error = null

    if (editId) {
      const res = await supabase
        .from('artikel')
        .update(payload)
        .eq('id', editId)
      error = res.error
    } else {
      const res = await supabase
        .from('artikel')
        .insert(payload)
      error = res.error
    }

    setLoading(false)

    if (error) {
      setErrorMsg(`Gagal menyimpan: ${error.message}`)
    } else {
      setSuccessMsg(published ? 'Artikel berhasil dipublikasikan!' : 'Draft berhasil disimpan!')
      setTimeout(() => router.push(`/${lang}/admin`), 1500)
    }
  }

  if (loadingData) {
    return (
      <main className="bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <p className="font-[Manrope] text-[#586064]">Memuat data artikel...</p>
      </main>
    )
  }

  return (
    <main className="bg-[#f8f9fa] min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-[#dbe4e7]"
        style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>
        <div className="max-w-[1440px] mx-auto px-8 py-8 flex justify-between items-center">
          <div>
            <span className="font-[Manrope] text-xs tracking-[0.2em] text-[#506072] uppercase mb-1 block">
              Admin Panel
            </span>
            <h1 className="font-[Noto_Serif] text-3xl font-bold text-[#2b3437]">
              {editId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="font-[Manrope] text-sm text-[#586064] hover:text-[#2b3437] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-12">

        {/* Success / Error */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 font-[Manrope] text-sm px-6 py-4 rounded-xl mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 font-[Manrope] text-sm px-6 py-4 rounded-xl mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl p-8 md:p-12 space-y-10"
          style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>

          {/* Judul */}
          <div>
            <h2 className="font-[Noto_Serif] text-lg font-bold text-[#2b3437] mb-6 pb-4 border-b border-[#f1f4f6]">
              Judul & Slug
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Judul (Indonesia) *"
                name="judul_id"
                value={form.judul_id}
                onChange={handleChange}
                placeholder="Masukkan judul dalam Bahasa Indonesia"
              />
              <Field
                label="Title (English) *"
                name="judul_en"
                value={form.judul_en}
                onChange={handleChange}
                placeholder="Enter title in English"
              />
            </div>
            <div className="mt-6">
              <Field
                label="Slug (URL)"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                hint={`URL: /${lang}/artikel/${form.slug || 'slug-artikel'}`}
                placeholder="slug-artikel-otomatis"
              />
            </div>
          </div>

          {/* Gambar & Kategori */}
          <div>
            <h2 className="font-[Noto_Serif] text-lg font-bold text-[#2b3437] mb-6 pb-4 border-b border-[#f1f4f6]">
              Media & Kategori
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="URL Gambar"
                name="gambar_url"
                value={form.gambar_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
              <div>
                <label className="block font-[Manrope] text-xs uppercase tracking-widest text-[#586064] font-bold mb-2">
                  Kategori
                </label>
                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  className="w-full border border-[#dbe4e7] rounded-lg px-4 py-3 font-[Manrope] text-sm text-[#2b3437] bg-white focus:outline-none focus:border-[#506072] focus:ring-1 focus:ring-[#506072] transition-colors"
                >
                  {['Destinasi', 'Itinerary', 'Review', 'Panduan', 'Kuliner', 'Tips'].map(k => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview Gambar */}
            {form.gambar_url && (
              <div className="mt-6">
                <p className="font-[Manrope] text-xs uppercase tracking-widest text-[#586064] font-bold mb-3">
                  Preview Gambar
                </p>
                <img
                  src={form.gambar_url}
                  alt="preview"
                  className="w-full max-h-72 object-cover rounded-xl"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <h2 className="font-[Noto_Serif] text-lg font-bold text-[#2b3437] mb-6 pb-4 border-b border-[#f1f4f6]">
              Deskripsi Singkat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextArea
                label="Deskripsi (Indonesia)"
                name="deskripsi_id"
                value={form.deskripsi_id}
                onChange={handleChange}
                rows={4}
                placeholder="Deskripsi singkat yang tampil di halaman utama..."
              />
              <TextArea
                label="Description (English)"
                name="deskripsi_en"
                value={form.deskripsi_en}
                onChange={handleChange}
                rows={4}
                placeholder="Short description shown on the home page..."
              />
            </div>
          </div>

          {/* Konten */}
          <div>
            <h2 className="font-[Noto_Serif] text-lg font-bold text-[#2b3437] mb-2 pb-4 border-b border-[#f1f4f6]">
              Konten Artikel
            </h2>
            <p className="font-[Manrope] text-xs text-[#abb3b7] mb-6">
              Gunakan tag HTML: &lt;p&gt; &lt;h2&gt; &lt;h3&gt; &lt;ul&gt; &lt;ol&gt; &lt;li&gt; &lt;strong&gt; &lt;blockquote&gt;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextArea
                label="Konten (Indonesia)"
                name="konten_id"
                value={form.konten_id}
                onChange={handleChange}
                rows={20}
                placeholder="<p>Isi artikel dalam Bahasa Indonesia...</p>"
                mono
              />
              <TextArea
                label="Content (English)"
                name="konten_en"
                value={form.konten_en}
                onChange={handleChange}
                rows={20}
                placeholder="<p>Article content in English...</p>"
                mono
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-[#f1f4f6]">
            <button
              onClick={() => handleSave(true)}
              disabled={loading}
              className="flex-1 bg-[#506072] text-white py-4 rounded-lg font-[Manrope] font-bold text-sm uppercase tracking-widest hover:bg-[#445465] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">public</span>
              {loading ? 'Menyimpan...' : 'Publikasikan'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="flex-1 border border-[#dbe4e7] text-[#506072] py-4 rounded-lg font-[Manrope] font-bold text-sm uppercase tracking-widest hover:bg-[#f1f4f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">draft</span>
              {loading ? 'Menyimpan...' : 'Simpan Draft'}
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}

// ── Helper Components ──

function Field({
  label, name, value, onChange, hint, placeholder
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  hint?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block font-[Manrope] text-xs uppercase tracking-widest text-[#586064] font-bold mb-2">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[#dbe4e7] rounded-lg px-4 py-3 font-[Manrope] text-sm text-[#2b3437] bg-white focus:outline-none focus:border-[#506072] focus:ring-1 focus:ring-[#506072] transition-colors"
      />
      {hint && (
        <p className="font-[Manrope] text-xs text-[#abb3b7] mt-1">{hint}</p>
      )}
    </div>
  )
}

function TextArea({
  label, name, value, onChange, rows, placeholder, mono
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows: number
  placeholder?: string
  mono?: boolean
}) {
  return (
    <div>
      <label className="block font-[Manrope] text-xs uppercase tracking-widest text-[#586064] font-bold mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`w-full border border-[#dbe4e7] rounded-lg px-4 py-3 text-sm text-[#2b3437] bg-white focus:outline-none focus:border-[#506072] focus:ring-1 focus:ring-[#506072] transition-colors resize-y ${mono ? 'font-mono' : 'font-[Manrope]'}`}
      />
    </div>
  )
}