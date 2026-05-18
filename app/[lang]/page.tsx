import { supabase } from '@/lib/supabase'
import { dict, Lang } from '@/lib/i18n'
import Link from 'next/link'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langRaw } = await params
  const lang = (langRaw === 'en' ? 'en' : 'id') as Lang
  const t = dict[lang]

  // Ambil semua artikel published
  const { data: artikelList } = await supabase
    .from('artikel')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(7)

  // Artikel pertama jadi hero, sisanya jadi grid
  const hero = artikelList?.[0] ?? null
  const artikelLainnya = artikelList?.slice(1) ?? []

  const judul = (a: any) => lang === 'id' ? a.judul_id : a.judul_en
  const deskripsi = (a: any) => lang === 'id' ? a.deskripsi_id : a.deskripsi_en

  return (
    <main className="bg-[#f8f9fa] text-[#2b3437]">

      {/* ── HERO: Artikel Unggulan ── */}
      {hero ? (
        <section className="relative w-full min-h-[90vh] flex items-end overflow-hidden">

          {/* Background gambar artikel */}
          <img
            src={hero.gambar_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=90'}
            alt={judul(hero)}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlay dari bawah */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1618] via-[#0d1618]/60 to-transparent" />

          {/* Gradient overlay dari kiri — untuk readability teks */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1618]/70 via-[#0d1618]/20 to-transparent" />

          {/* Konten hero */}
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 pb-16 md:pb-24 pt-32">
            <div className="max-w-[680px]">

              {/* Label kategori + eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white font-[Manrope] text-[10px] tracking-widest uppercase rounded border border-white/20">
                  {hero.kategori}
                </span>
                <div className="w-6 h-px bg-white/40" />
                <span className="font-[Manrope] text-xs tracking-[0.2em] text-white/60 uppercase">
                  {lang === 'id' ? 'Artikel Unggulan' : 'Featured Article'}
                </span>
              </div>

              {/* Judul artikel */}
              <h1 className="font-[Noto_Serif] text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 tracking-tight">
                {judul(hero)}
              </h1>

              {/* Deskripsi */}
              <p className="font-[Manrope] text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-lg line-clamp-3">
                {deskripsi(hero)}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href={`/${lang}/artikel/${hero.slug}`}
                  className="group inline-flex items-center gap-3 bg-white text-[#2b3437] px-8 py-4 font-[Manrope] font-bold text-sm uppercase tracking-widest hover:bg-[#d3e4fa] transition-colors duration-300"
                >
                  {t.home.read_more}
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">
                    arrow_forward
                  </span>
                </Link>
                <span className="font-[Manrope] text-xs text-white/50">
                  {new Date(hero.created_at).toLocaleDateString(
                    lang === 'id' ? 'id-ID' : 'en-US',
                    { day: 'numeric', month: 'long', year: 'numeric' }
                  )}
                </span>
              </div>

            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hidden md:flex absolute bottom-8 right-8 flex-col items-center gap-2 z-10">
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/40" />
            <span className="font-[Manrope] text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          </div>

        </section>
      ) : (
        /* Fallback jika belum ada artikel */
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-[#2b3437]">
          <div className="max-w-[1440px] mx-auto px-8 py-24 text-center w-full">
            <p className="font-[Noto_Serif] text-3xl text-white/60 italic mb-4">
              {lang === 'id' ? 'Belum ada artikel unggulan' : 'No featured article yet'}
            </p>
            <p className="font-[Manrope] text-sm text-white/40">
              {lang === 'id'
                ? 'Artikel pertama yang kamu publish akan tampil di sini.'
                : 'The first article you publish will appear here.'}
            </p>
          </div>
        </section>
      )}

      {/* ── ARTIKEL LAINNYA ── */}
      {artikelLainnya.length > 0 && (
        <section id="artikel" className="py-20 md:py-28 px-8 bg-[#f8f9fa]">
          <div className="max-w-[1440px] mx-auto">

            {/* Section header */}
            <div className="flex items-end justify-between mb-14">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-px bg-[#506072]" />
                  <span className="font-[Manrope] text-xs tracking-[0.3em] text-[#506072] uppercase">
                    {lang === 'id' ? 'Terbaru' : 'Latest'}
                  </span>
                </div>
                <h2 className="font-[Noto_Serif] text-3xl md:text-4xl text-[#2b3437]">
                  {t.home.latest}
                </h2>
              </div>
            </div>

            {/* Grid artikel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artikelLainnya.map((artikel) => (
                <article key={artikel.id} className="group bg-white rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                  style={{ boxShadow: '0 4px 24px rgba(43,52,55,0.07)' }}>

                  {/* Gambar */}
                  <Link href={`/${lang}/artikel/${artikel.slug}`} className="block overflow-hidden aspect-[16/10]">
                    <img
                      alt={judul(artikel)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={artikel.gambar_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'}
                    />
                  </Link>

                  {/* Konten */}
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

                    <h3 className="font-[Noto_Serif] text-lg text-[#2b3437] mb-3 leading-snug group-hover:text-[#506072] transition-colors duration-200 line-clamp-2">
                      {judul(artikel)}
                    </h3>

                    <p className="font-[Manrope] text-sm text-[#586064] line-clamp-2 mb-5 leading-relaxed">
                      {deskripsi(artikel)}
                    </p>

                    <Link
                      href={`/${lang}/artikel/${artikel.slug}`}
                      className="group/link inline-flex items-center gap-1.5 font-[Manrope] text-xs font-bold uppercase tracking-widest text-[#506072] hover:gap-2.5 transition-all duration-200"
                    >
                      {t.home.read_more}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>

                </article>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ── EMPTY STATE (tidak ada artikel sama sekali) ── */}
      {!hero && artikelLainnya.length === 0 && (
        <section className="py-24 px-8 text-center">
          <p className="font-[Noto_Serif] text-xl text-[#2b3437] mb-2">
            {lang === 'id' ? 'Belum ada artikel' : 'No articles yet'}
          </p>
          <p className="font-[Manrope] text-sm text-[#586064]">
            {lang === 'id'
              ? 'Artikel akan muncul di sini setelah dipublikasikan.'
              : 'Articles will appear here once published.'}
          </p>
        </section>
      )}

    </main>
  )
}