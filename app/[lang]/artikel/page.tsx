import { supabase } from '@/lib/supabase'
import { dict, Lang } from '@/lib/i18n'
import Link from 'next/link'

const PULAU    = ['Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Bali & NTT', 'Papua']
const KATEGORI = ['Destinasi', 'Itinerary', 'Tips', 'Panduan', 'Kuliner']

interface Props {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ kategori?: string; pulau?: string; durasi?: string; jenis?: string; q?: string }>
}

export default async function ArtikelPage({ params, searchParams }: Props) {
  const { lang: langRaw } = await params
  const lang = (langRaw === 'en' ? 'en' : 'id') as Lang
  const t = dict[lang]

  const { kategori, pulau, durasi, jenis, q } = await searchParams

  // Build query Supabase
  let query = supabase
    .from('artikel')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (kategori) query = query.ilike('kategori', `%${kategori}%`)
  if (pulau)    query = query.ilike('tags', `%${pulau}%`)
  if (q)        query = query.or(`judul_id.ilike.%${q}%,judul_en.ilike.%${q}%,deskripsi_id.ilike.%${q}%`)

  const { data: artikelList } = await query

  const judul    = (a: any) => lang === 'id' ? a.judul_id : a.judul_en
  const deskripsi = (a: any) => lang === 'id' ? a.deskripsi_id : a.deskripsi_en

  // Label halaman aktif
  const activeLabel = pulau ?? kategori ?? (q ? `"${q}"` : t.artikel.semua)

  return (
    <main className="bg-[#f8f9fa] min-h-screen">

      {/* ── PAGE HEADER ── */}
      <section className="bg-[#2b3437] px-8 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-[#506072]" />
            <span className="font-[Manrope] text-xs tracking-[0.3em] text-[#586064] uppercase">
              {t.artikel.semua}
            </span>
          </div>
          <h1 className="font-[Noto_Serif] text-4xl md:text-5xl text-white mb-4">
            {activeLabel}
          </h1>
          <p className="font-[Manrope] text-sm text-[#abb3b7]">
            {artikelList?.length ?? 0} {lang === 'id' ? 'artikel ditemukan' : 'articles found'}
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-8 py-12 flex flex-col md:flex-row gap-12">

        {/* ── SIDEBAR FILTER ── */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-8">

            {/* Search */}
            <div>
              <p className="font-[Manrope] text-[10px] uppercase tracking-widest text-[#abb3b7] font-bold mb-3">
                {lang === 'id' ? 'Cari Artikel' : 'Search'}
              </p>
              <form method="GET">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder={lang === 'id' ? 'Ketik kata kunci...' : 'Search articles...'}
                  className="w-full border border-[#dbe4e7] bg-white px-4 py-2.5 font-[Manrope] text-sm text-[#2b3437] focus:outline-none focus:border-[#506072] rounded"
                />
              </form>
            </div>

            {/* Filter Kategori */}
            <div>
              <p className="font-[Manrope] text-[10px] uppercase tracking-widest text-[#abb3b7] font-bold mb-3">
                {lang === 'id' ? 'Kategori' : 'Category'}
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    href={`/${lang}/artikel`}
                    className={`block font-[Manrope] text-sm px-3 py-2 rounded transition-colors ${!kategori && !pulau ? 'bg-[#2b3437] text-white' : 'text-[#586064] hover:bg-[#f1f4f6]'}`}
                  >
                    {t.artikel.semua}
                  </Link>
                </li>
                {KATEGORI.map(k => (
                  <li key={k}>
                    <Link
                      href={`/${lang}/artikel?kategori=${encodeURIComponent(k)}`}
                      className={`block font-[Manrope] text-sm px-3 py-2 rounded transition-colors ${kategori === k ? 'bg-[#2b3437] text-white' : 'text-[#586064] hover:bg-[#f1f4f6]'}`}
                    >
                      {k}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter Pulau */}
            <div>
              <p className="font-[Manrope] text-[10px] uppercase tracking-widest text-[#abb3b7] font-bold mb-3">
                {lang === 'id' ? 'Pulau / Region' : 'Island / Region'}
              </p>
              <ul className="space-y-1">
                {PULAU.map(p => (
                  <li key={p}>
                    <Link
                      href={`/${lang}/artikel?pulau=${encodeURIComponent(p)}`}
                      className={`block font-[Manrope] text-sm px-3 py-2 rounded transition-colors ${pulau === p ? 'bg-[#2b3437] text-white' : 'text-[#586064] hover:bg-[#f1f4f6]'}`}
                    >
                      {p}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </aside>

        {/* ── ARTIKEL GRID ── */}
        <div className="flex-1">
          {artikelList && artikelList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {artikelList.map(artikel => (
                <article key={artikel.id}
                  className="group bg-white rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                  style={{ boxShadow: '0 4px 24px rgba(43,52,55,0.07)' }}>

                  <Link href={`/${lang}/artikel/${artikel.slug}`} className="block aspect-[16/10] overflow-hidden">
                    <img
                      alt={judul(artikel)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={artikel.gambar_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'}
                    />
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-2.5 py-1 bg-[#d3e4fa] text-[#435365] font-[Manrope] text-[10px] tracking-widest uppercase rounded">
                        {artikel.kategori}
                      </span>
                      <span className="font-[Manrope] text-xs text-[#abb3b7]">
                        {new Date(artikel.created_at).toLocaleDateString(
                          lang === 'id' ? 'id-ID' : 'en-US',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </span>
                    </div>
                    <h3 className="font-[Noto_Serif] text-lg text-[#2b3437] mb-3 leading-snug group-hover:text-[#506072] transition-colors line-clamp-2">
                      {judul(artikel)}
                    </h3>
                    <p className="font-[Manrope] text-sm text-[#586064] line-clamp-2 mb-5 leading-relaxed">
                      {deskripsi(artikel)}
                    </p>
                    <Link
                      href={`/${lang}/artikel/${artikel.slug}`}
                      className="inline-flex items-center gap-1.5 font-[Manrope] text-xs font-bold uppercase tracking-widest text-[#506072] hover:gap-3 transition-all duration-200"
                    >
                      {t.home.read_more}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>

                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-[#dbe4e7] rounded-xl">
              <p className="font-[Noto_Serif] text-xl text-[#2b3437] mb-3">{t.artikel.tidak_ada}</p>
              <Link
                href={`/${lang}/artikel`}
                className="font-[Manrope] text-sm text-[#506072] underline"
              >
                {lang === 'id' ? 'Lihat semua artikel' : 'View all articles'}
              </Link>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
