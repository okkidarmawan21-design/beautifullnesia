import { supabase } from '@/lib/supabase'
import { dict, Lang } from '@/lib/i18n'
import Link from 'next/link'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langRaw } = await params
  const lang = (langRaw === 'en' ? 'en' : 'id') as Lang
  const t = dict[lang]

  const { data: artikelList } = await supabase
    .from('artikel')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <main className="bg-[#f8f9fa] text-[#2b3437]">

      {/* ── HERO ── */}
      <section className="relative px-8 py-12 md:py-20 max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

          {/* Left: Text */}
          <div className="md:col-span-5 z-10">
            <span className="font-[Manrope] text-xs tracking-[0.2em] text-[#506072] uppercase mb-4 block">
              {t.home.eyebrow}
            </span>
            <h1 className="font-[Noto_Serif] text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 text-[#2b3437]">
              {t.home.hero_title_1}<br />
              <span className="italic font-normal">{t.home.hero_title_2}</span>
            </h1>
            <p className="text-[#586064] max-w-md leading-relaxed mb-10">
              {t.home.hero_subtitle}
            </p>
            <Link
              href={`/${lang}/artikel`}
              className="bg-[#506072] text-[#f5f8ff] px-8 py-4 rounded-md font-medium hover:bg-[#445465] transition-colors inline-flex items-center gap-3"
            >
              {t.home.cta}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Right: Hero Image */}
          <div className="md:col-span-7 relative mt-8 md:mt-0">
            <div className="aspect-[4/5] md:aspect-[16/10] bg-[#e3e9ec] rounded-xl overflow-hidden relative"
              style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>
              <img
                alt="Keindahan Indonesia"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b3437]/40 to-transparent" />
            </div>
            {/* Floating mini card */}
            <div className="hidden md:block absolute -bottom-10 -left-10 w-48 h-64 bg-white rounded-xl p-4"
              style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>
              <img
                alt="Destinasi Indonesia"
                className="w-full h-full object-cover rounded-lg"
                src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTIKEL TERBARU ── */}
      <section className="bg-[#f1f4f6] py-24 px-8 mt-12 md:mt-0">
        <div className="max-w-[1440px] mx-auto">

          {/* Section Header */}
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="font-[Manrope] text-xs tracking-[0.2em] text-[#506072] uppercase mb-2 block">
                {lang === 'id' ? 'Terbaru' : 'Latest'}
              </span>
              <h2 className="font-[Noto_Serif] text-4xl md:text-5xl text-[#2b3437]">
                {t.home.latest}
              </h2>
            </div>
          </div>

          {/* Article List */}
          {artikelList && artikelList.length > 0 ? (
            <div className="space-y-16">
              {artikelList.map((artikel) => (
                <article key={artikel.id} className="flex flex-col md:flex-row gap-8 group">

                  {/* Thumbnail */}
                  <Link
                    href={`/${lang}/artikel/${artikel.slug}`}
                    className="w-full md:w-2/5 aspect-[16/10] overflow-hidden rounded-lg block flex-shrink-0"
                  >
                    <img
                      alt={lang === 'id' ? artikel.judul_id : artikel.judul_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={artikel.gambar_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'}
                    />
                  </Link>

                  {/* Text */}
                  <div className="w-full md:w-3/5">
                    <span className="inline-block px-3 py-1 bg-[#d3e4fa] text-[#435365] font-[Manrope] text-[10px] tracking-widest uppercase rounded mb-4">
                      {artikel.kategori}
                    </span>
                    <h3 className="font-[Noto_Serif] text-2xl text-[#2b3437] mb-4 leading-snug group-hover:text-[#506072] transition-colors">
                      {lang === 'id' ? artikel.judul_id : artikel.judul_en}
                    </h3>
                    <p className="text-[#586064] line-clamp-2 mb-6">
                      {lang === 'id' ? artikel.deskripsi_id : artikel.deskripsi_en}
                    </p>
                    <Link
                      href={`/${lang}/artikel/${artikel.slug}`}
                      className="font-[Manrope] text-sm text-[#506072] flex items-center gap-2 group/link font-semibold"
                    >
                      {t.home.read_more}
                      <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  </div>

                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#586064] italic text-lg mb-6">
                {lang === 'id' ? 'Belum ada artikel.' : 'No articles yet.'}
              </p>
              <Link
                href={`/${lang}/admin/login`}
                className="inline-block bg-[#506072] text-white px-6 py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#445465] transition-colors"
              >
                {lang === 'id' ? 'Tulis Artikel Pertama' : 'Write First Article'}
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ── AUTHOR SIDEBAR SECTION ── */}
      <section className="bg-[#f1f4f6] py-16 px-8 border-t border-[#dbe4e7]/60">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row gap-20">

            {/* Recent Posts teaser (kosong, bisa diisi nanti) */}
            <div className="w-full md:w-2/3" />

            {/* Author Card */}
            <aside className="w-full md:w-1/3">
              <div className="bg-white p-10 rounded-xl sticky top-32"
                style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>
                <h4 className="font-[Manrope] text-xs tracking-widest text-[#506072] uppercase mb-8">
                  {lang === 'id' ? 'Redaktur Konten' : 'Content Editor'}
                </h4>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 outline outline-offset-4 outline-[#abb3b7]/30">
                    <img
                      alt="Author"
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/vector-1740737650825-1ce4f5377085?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                  </div>
                  <h3 className="font-[Noto_Serif] text-xl text-[#2b3437] mb-2">
                    {lang === 'id' ? 'Tentang Kami' : 'About Us'}
                  </h3>
                  <p className="font-[Manrope] text-sm text-[#586064] leading-relaxed mb-8">
                    {lang === 'id'
                      ? 'Beautifulnesia adalah referensi perjalanan independen yang menghadirkan ulasan menyeluruh tentang setiap sudut keindahan Indonesia.'
                      : 'Beautifulnesia is an independent travel reference providing comprehensive insights into every corner of Indonesian beauty.'}
                  </p>
                  <div className="mt-8 pt-8 border-t border-[#f1f4f6] flex justify-center gap-6 text-[#586064]">
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#506072] transition-colors">share</span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#506072] transition-colors">mail</span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#506072] transition-colors">public</span>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

    </main>
  )
}