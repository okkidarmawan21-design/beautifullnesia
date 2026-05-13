import { supabase } from '@/lib/supabase'
import { dict, Lang } from '@/lib/i18n'
import Link from 'next/link'

export default async function Home({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const t = dict[lang].home

  const { data: artikelList } = await supabase
    .from('artikel')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <main>

      {/* Hero */}
      <section className="relative px-6 md:px-8 py-12 md:py-20 max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 z-10">
            <span className="font-[Manrope] text-xs tracking-[0.2em] text-[#506072] uppercase mb-4 block">{t.eyebrow}</span>
            <h1 className="font-[Noto_Serif] text-5xl md:text-7xl lg:text-8xl leading-tight mb-8">
              {t.hero_title_1}<br/><span className="italic font-normal">{t.hero_title_2}</span>
            </h1>
            <p className="text-[#586064] max-w-md leading-relaxed mb-10">{t.hero_subtitle}</p>
            <Link href={`/${lang}/artikel`} className="bg-[#506072] text-white px-8 py-4 rounded-md font-medium hover:bg-[#445465] transition-colors inline-flex items-center gap-3">
              {t.cta}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="md:col-span-7 relative">
            <div className="aspect-[4/5] md:aspect-[16/10] bg-[#e3e9ec] rounded-xl overflow-hidden relative">
              <img
                alt="Keindahan Indonesia"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b3437]/40 to-transparent"/>
            </div>
          </div>
        </div>
      </section>

      {/* Artikel Terbaru */}
      <section className="bg-[#f1f4f6] py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <h2 className="font-[Noto_Serif] text-3xl md:text-5xl">{t.latest}</h2>
          </div>

          {artikelList && artikelList.length > 0 ? (
            <div className="space-y-12 md:space-y-16">
              {artikelList.map((artikel) => (
                <article key={artikel.id} className="flex flex-col md:flex-row gap-6 md:gap-8 group">
                  <Link href={`/${lang}/artikel/${artikel.slug}`} className="w-full md:w-2/5 aspect-[16/10] overflow-hidden rounded-lg block flex-shrink-0">
                    <img
                      alt={lang === 'id' ? artikel.judul_id : artikel.judul_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={artikel.gambar_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'}
                    />
                  </Link>
                  <div className="w-full md:w-3/5">
                    <span className="inline-block px-3 py-1 bg-[#d3e4fa] text-[#435365] text-[10px] tracking-widest uppercase rounded mb-4 font-[Manrope]">
                      {artikel.kategori}
                    </span>
                    <h3 className="font-[Noto_Serif] text-xl md:text-2xl text-[#2b3437] mb-4 leading-snug group-hover:text-[#506072] transition-colors">
                      {lang === 'id' ? artikel.judul_id : artikel.judul_en}
                    </h3>
                    <p className="text-[#586064] line-clamp-2 mb-6 text-sm md:text-base">
                      {lang === 'id' ? artikel.deskripsi_id : artikel.deskripsi_en}
                    </p>
                    <Link href={`/${lang}/artikel/${artikel.slug}`} className="font-[Manrope] text-sm text-[#506072] flex items-center gap-2 hover:gap-3 transition-all font-semibold">
                      {t.read_more}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-[#586064] italic">
              {lang === 'id' ? 'Belum ada artikel.' : 'No articles yet.'}
            </p>
          )}
        </div>
      </section>

    </main>
  )
}