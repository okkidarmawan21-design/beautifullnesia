'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

const PULAU    = ['Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Bali & NTT', 'Papua']
const KATEGORI = ['Destinasi', 'Itinerary', 'Tips', 'Panduan', 'Kuliner']

export default function TulisArtikel() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const params       = useParams()
  const lang         = params.lang as string
  const editId       = searchParams.get('id')

  const [loading,     setLoading]     = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [successMsg,  setSuccessMsg]  = useState('')
  const [errorMsg,    setErrorMsg]    = useState('')

  const [form, setForm] = useState({
    judul_id:    '',
    judul_en:    '',
    slug:        '',
    deskripsi_id:'',
    deskripsi_en:'',
    konten_id:   '',
    konten_en:   '',
    gambar_url:  '',
    kategori:    'Destinasi',
    tags:        '',        // ← pulau/region
    published:   true,
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Load data jika mode edit
  useEffect(() => {
    if (!editId) return
    setLoadingData(true)
    supabase.from('artikel').select('*').eq('id', editId).single()
      .then(({ data }) => {
        if (data) setForm({ ...data, tags: data.tags ?? '' })
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

  // Toggle pilih pulau — bisa pilih lebih dari satu, dipisah koma
  const togglePulau = (pulau: string) => {
    setForm(prev => {
      const current = prev.tags ? prev.tags.split(',').map(s => s.trim()).filter(Boolean) : []
      const exists  = current.includes(pulau)
      const next    = exists ? current.filter(p => p !== pulau) : [...current, pulau]
      return { ...prev, tags: next.join(', ') }
    })
  }

  const selectedPulau = form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : []

  const handleSave = async (published: boolean) => {
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
      judul_id:    form.judul_id,
      judul_en:    form.judul_en,
      slug:        form.slug,
      deskripsi_id:form.deskripsi_id,
      deskripsi_en:form.deskripsi_en,
      konten_id:   form.konten_id,
      konten_en:   form.konten_en,
      gambar_url:  form.gambar_url,
      kategori:    form.kategori,
      tags:        form.tags,
      published,
    }

    const res = editId
      ? await supabase.from('artikel').update(payload).eq('id', editId)
      : await supabase.from('artikel').insert(payload)

    setLoading(false)

    if (res.error) {
      setErrorMsg(`Gagal menyimpan: ${res.error.message}`)
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
        style={{ boxShadow: '0 4px 24px rgba(43,52,55,0.06)' }}>
        <div className="max-w-[1440px] mx-auto px-8 py-8 flex justify-between items-center">
          <div>
            <span className="font-[Manrope] text-xs tracking-[0.2em] text-[#506072] uppercase mb-1 block">Admin Panel</span>
            <h1 className="font-[Noto_Serif] text-3xl font-bold text-[#2b3437]">
              {editId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
            </h1>
          </div>
          <button onClick={() => router.back()}
            className="font-[Manrope] text-sm text-[#586064] hover:text-[#2b3437] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-12">

        {/* Notifikasi */}
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
          style={{ boxShadow: '0 4px 24px rgba(43,52,55,0.06)' }}>

          {/* ── 1. JUDUL & SLUG ── */}
          <div>
            <SectionTitle>Judul & Slug</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Judul (Indonesia) *" name="judul_id" value={form.judul_id} onChange={handleChange} placeholder="Judul dalam Bahasa Indonesia" />
              <Field label="Title (English) *"   name="judul_en" value={form.judul_en} onChange={handleChange} placeholder="Title in English" />
            </div>
            <div className="mt-6">
              <Field
                label="Slug (URL)"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                hint={`URL: /${lang}/artikel/${form.slug || 'slug-artikel'}`}
                placeholder="slug-otomatis"
              />
            </div>
          </div>

          {/* ── 2. KATEGORI & PULAU ── */}
          <div>
            <SectionTitle>Kategori & Lokasi</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              {/* Kategori */}
              <div>
                <label className="block font-[Manrope] text-xs uppercase tracking-widest text-[#586064] font-bold mb-2">
                  Kategori
                </label>
                <select name="kategori" value={form.kategori} onChange={handleChange}
                  className="w-full border border-[#dbe4e7] rounded-lg px-4 py-3 font-[Manrope] text-sm text-[#2b3437] bg-white focus:outline-none focus:border-[#506072]">
                  {KATEGORI.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>

              {/* Tags (teks manual) */}
              <Field
                label="Tags Lokasi (pisah koma)"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="cth: Kalimantan, Sambas"
                hint="Digunakan untuk filter di navbar"
              />
            </div>

            {/* Tombol pilih pulau cepat */}
            <div>
              <p className="font-[Manrope] text-xs uppercase tracking-widest text-[#abb3b7] font-bold mb-3">
                Pilih Pulau (klik untuk menambah ke tags)
              </p>
              <div className="flex flex-wrap gap-2">
                {PULAU.map(p => {
                  const active = selectedPulau.includes(p)
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePulau(p)}
                      className={`px-4 py-2 font-[Manrope] text-xs font-bold uppercase tracking-widest rounded transition-all duration-200 ${
                        active
                          ? 'bg-[#2b3437] text-white'
                          : 'border border-[#dbe4e7] text-[#586064] hover:border-[#506072] hover:text-[#506072]'
                      }`}
                    >
                      {active && '✓ '}{p}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── 3. GAMBAR ── */}
          <div>
            <SectionTitle>Gambar</SectionTitle>
            <Field
              label="URL Gambar"
              name="gambar_url"
              value={form.gambar_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              hint="Gunakan Unsplash untuk foto gratis berkualitas tinggi"
            />
            {form.gambar_url && (
              <div className="mt-4">
                <p className="font-[Manrope] text-xs uppercase tracking-widest text-[#586064] font-bold mb-2">Preview</p>
                <img src={form.gambar_url} alt="preview"
                  className="w-full max-h-64 object-cover rounded-xl"
                  onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          {/* ── 4. DESKRIPSI ── */}
          <div>
            <SectionTitle>Deskripsi Singkat</SectionTitle>
            <p className="font-[Manrope] text-xs text-[#abb3b7] mb-4">
              Tampil di halaman utama dan hasil pencarian. Maksimal 2 kalimat.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextArea label="Deskripsi (Indonesia)" name="deskripsi_id" value={form.deskripsi_id} onChange={handleChange} rows={3} placeholder="Deskripsi singkat dalam Bahasa Indonesia..." />
              <TextArea label="Description (English)" name="deskripsi_en" value={form.deskripsi_en} onChange={handleChange} rows={3} placeholder="Short description in English..." />
            </div>
          </div>

          {/* ── 5. KONTEN ── */}
          <div>
            <SectionTitle>Konten Artikel</SectionTitle>
            <p className="font-[Manrope] text-xs text-[#abb3b7] mb-4">
              Gunakan tag HTML: &lt;p&gt; &lt;h2&gt; &lt;h3&gt; &lt;ul&gt; &lt;ol&gt; &lt;li&gt; &lt;strong&gt; &lt;blockquote&gt;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextArea label="Konten (Indonesia)" name="konten_id" value={form.konten_id} onChange={handleChange} rows={20} placeholder="<p>Isi artikel...</p>" mono />
              <TextArea label="Content (English)"  name="konten_en" value={form.konten_en} onChange={handleChange} rows={20} placeholder="<p>Article content...</p>" mono />
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-[#f1f4f6]">
            <button
              onClick={() => handleSave(true)}
              disabled={loading}
              className="flex-1 bg-[#506072] text-white py-4 rounded-lg font-[Manrope] font-bold text-sm uppercase tracking-widest hover:bg-[#2b3437] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">public</span>
              {loading ? 'Menyimpan...' : 'Publikasikan'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="flex-1 border border-[#dbe4e7] text-[#506072] py-4 rounded-lg font-[Manrope] font-bold text-sm uppercase tracking-widest hover:bg-[#f1f4f6] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[Noto_Serif] text-lg font-bold text-[#2b3437] mb-6 pb-4 border-b border-[#f1f4f6]">
      {children}
    </h2>
  )
}

function Field({ label, name, value, onChange, hint, placeholder }: {
  label: string; name: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  hint?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block font-[Manrope] text-xs uppercase tracking-widest text-[#586064] font-bold mb-2">{label}</label>
      <input
        name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full border border-[#dbe4e7] rounded-lg px-4 py-3 font-[Manrope] text-sm text-[#2b3437] bg-white focus:outline-none focus:border-[#506072] focus:ring-1 focus:ring-[#506072] transition-colors"
      />
      {hint && <p className="font-[Manrope] text-xs text-[#abb3b7] mt-1">{hint}</p>}
    </div>
  )
}

function TextArea({ label, name, value, onChange, rows, placeholder, mono }: {
  label: string; name: string; value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows: number; placeholder?: string; mono?: boolean
}) {
  return (
    <div>
      <label className="block font-[Manrope] text-xs uppercase tracking-widest text-[#586064] font-bold mb-2">{label}</label>
      <textarea
        name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder}
        className={`w-full border border-[#dbe4e7] rounded-lg px-4 py-3 text-sm text-[#2b3437] bg-white focus:outline-none focus:border-[#506072] focus:ring-1 focus:ring-[#506072] transition-colors resize-y ${mono ? 'font-mono' : 'font-[Manrope]'}`}
      />
    </div>
  )
}