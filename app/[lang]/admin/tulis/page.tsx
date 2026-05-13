'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TulisArtikel({ params }: { params: { lang: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    judul_id: '', judul_en: '',
    slug: '',
    deskripsi_id: '', deskripsi_en: '',
    konten_id: '', konten_en: '',
    gambar_url: '',
    kategori: 'Destinasi',
    published: true,
  })

  // Load data jika mode edit
  useEffect(() => {
    if (!editId) return
    supabase.from('artikel').select('*').eq('id', editId).single()
      .then(({ data }) => { if (data) setForm(data) })
  }, [editId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Auto-generate slug dari judul Indonesia
    if (name === 'judul_id') {
      setForm(prev => ({
        ...prev,
        judul_id: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    }
  }

  const handleSave = async (published: boolean) => {
    setLoading(true)
    const payload = { ...form, published }

    if (editId) {
      await supabase.from('artikel').update(payload).eq('id', editId)
    } else {
      await supabase.from('artikel').insert(payload)
    }

    setLoading(false)
    router.push(`/${params.lang}/admin`)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-[Noto_Serif] text-3xl font-bold text-[#2b3437]">
          {editId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
        </h1>
        <button onClick={() => router.back()} className="text-sm text-[#586064] hover:text-[#2b3437]">← Kembali</button>
      </div>

      <div className="space-y-8 bg-white rounded-xl p-8 shadow-sm">

        {/* Judul */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Judul (Indonesia)" name="judul_id" value={form.judul_id} onChange={handleChange} />
          <Field label="Title (English)" name="judul_en" value={form.judul_en} onChange={handleChange} />
        </div>

        {/* Slug */}
        <Field label="Slug (URL otomatis)" name="slug" value={form.slug} onChange={handleChange} hint={`/artikel/${form.slug}`} />

        {/* Gambar & Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="URL Gambar" name="gambar_url" value={form.gambar_url} onChange={handleChange} placeholder="https://..." />
          <div>
            <label className="text-xs uppercase tracking-widest text-[#586064] font-bold block mb-2">Kategori</label>
            <select name="kategori" value={form.kategori} onChange={handleChange}
              className="w-full border border-[#abb3b7] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#506072]">
              {['Destinasi','Itinerary','Review','Panduan','Kuliner','Tips'].map(k => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextArea label="Deskripsi (Indonesia)" name="deskripsi_id" value={form.deskripsi_id} onChange={handleChange} rows={3} />
          <TextArea label="Description (English)" name="deskripsi_en" value={form.deskripsi_en} onChange={handleChange} rows={3} />
        </div>

        {/* Konten */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextArea label="Konten (Indonesia) — HTML diperbolehkan" name="konten_id" value={form.konten_id} onChange={handleChange} rows={16} />
          <TextArea label="Content (English) — HTML allowed" name="konten_en" value={form.konten_en} onChange={handleChange} rows={16} />
        </div>

        {/* Preview gambar */}
        {form.gambar_url && (
          <div>
            <p className="text-xs uppercase tracking-widest text-[#586064] font-bold mb-2">Preview Gambar</p>
            <img src={form.gambar_url} alt="preview" className="w-full max-h-64 object-cover rounded-lg" />
          </div>
        )}

        {/* Tombol aksi */}
        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-[#f1f4f6]">
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="flex-1 bg-[#506072] text-white py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#445465] transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : '🌐 Publikasikan'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex-1 border border-[#abb3b7] text-[#506072] py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#f1f4f6] transition-colors disabled:opacity-50"
          >
            💾 Simpan Draft
          </button>
        </div>

      </div>
    </main>
  )
}

// Komponen helper
function Field({ label, name, value, onChange, hint, placeholder }: any) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[#586064] font-bold block mb-2">{label}</label>
      <input
        name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full border border-[#abb3b7] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#506072]"
      />
      {hint && <p className="text-xs text-[#abb3b7] mt-1">{hint}</p>}
    </div>
  )
}

function TextArea({ label, name, value, onChange, rows }: any) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[#586064] font-bold block mb-2">{label}</label>
      <textarea
        name={name} value={value} onChange={onChange} rows={rows}
        className="w-full border border-[#abb3b7] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#506072] resize-y font-mono"
      />
    </div>
  )
}