import { supabase } from '@/lib/supabase'
import { Lang } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ArtikelDetail({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang: langRaw, slug } = await params
  const lang = (langRaw === 'en' ? 'en' : 'id') as Lang

  const { data: artikel } = await supabase
    .from('artikel')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!artikel) notFound()

  const judul = lang === 'id' ? artikel.judul_id : artikel.judul_en
  const konten = lang === 'id' ? artikel.konten_id : artikel.konten_en
  const deskripsi = lang === 'id' ? artikel.deskripsi_id : artikel.deskripsi_en
  const otherLang = lang === 'id' ? 'en' : 'id'

  const tanggal = new Date(artikel.created_at).toLocaleDateString(
    lang === 'id' ? 'id-ID' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <main className="bg-[#f8f9fa] text-[#2b3437]">

      {/* ── BREADCRUMB ── */}
      <div className="max-w-[1440px] mx-auto px-8 pt-10 pb-2">
        <nav className="flex items-center gap-2 text-xs text-[#586064] uppercase tracking-widest font-[Manrope]">
          <Link href={`/${lang}`} className="hover:text-[#506072] transition-colors">
            {lang === 'id' ? 'Beranda' : 'Home'}
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#506072] font-bold">{artikel.kategori}</span>
        </nav>
      </div>

      {/* ── ARTICLE HEADER ── */}
      <header className="max-w-[1440px] mx-auto px-8 pt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

          {/* Left: Title block */}
          <div className="md:col-span-8">
            <div className="inline-block bg-[#d3e4fa] text-[#435365] px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase rounded mb-6 font-[Manrope]">
              {artikel.kategori}
            </div>
            <h1 className="font-[Noto_Serif] text-4xl md:text-6xl lg:text-7xl font-bold text-[#2b3437] leading-[1.1] mb-8 tracking-tight">
              {judul}
            </h1>
            <p className="text-[#586064] text-lg leading-relaxed max-w-2xl mb-10">
              {deskripsi}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 border-t border-[#dbe4e7] pt-8">
              <div>
                <p className="font-[Manrope] text-[10px] uppercase tracking-widest text-[#586064] mb-1">
                  {lang === 'id' ? 'Diterbitkan' : 'Published'}
                </p>
                <p className="font-[Noto_Serif] font-bold text-[#2b3437]">{tanggal}</p>
              </div>
              <div>
                <p className="font-[Manrope] text-[10px] uppercase tracking-widest text-[#586064] mb-1">
                  {lang === 'id' ? 'Kategori' : 'Category'}
                </p>
                <p className="font-[Noto_Serif] font-bold text-[#2b3437]">{artikel.kategori}</p>
              </div>
              {/* Language switcher */}
              <Link
                href={`/${otherLang}/artikel/${slug}`}
                className="ml-auto font-[Manrope] text-xs font-bold uppercase tracking-widest border border-[#506072]/30 px-4 py-2 rounded text-[#506072] hover:bg-[#506072] hover:text-white transition-all"
              >
                {otherLang === 'id' ? '🇮🇩 Baca dalam Indonesia' : '🇬🇧 Read in English'}
              </Link>
            </div>
          </div>

          {/* Right: small featured image (desktop only) */}
          {artikel.gambar_url && (
            <div className="hidden md:block md:col-span-4">
              <div className="aspect-[3/4] rounded-xl overflow-hidden"
                style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.10)' }}>
                <img
                  alt={judul}
                  className="w-full h-full object-cover"
                  src={artikel.gambar_url}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── HERO IMAGE (full width) ── */}
      {artikel.gambar_url && (
        <div className="w-full px-4 md:px-8 mb-16">
          <div className="max-w-[1440px] mx-auto rounded-xl overflow-hidden relative"
            style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.10)' }}>
            <img
              alt={judul}
              className="w-full aspect-[21/9] object-cover"
              src={artikel.gambar_url}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b3437]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="text-white font-[Noto_Serif] italic text-sm md:text-base opacity-90 max-w-2xl">
                {deskripsi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ARTICLE BODY + SIDEBAR ── */}
      <div className="max-w-[1440px] mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* Main Content */}
          <div className="md:col-span-8">
            <div
              className="
                font-[Manrope] text-[#2b3437] leading-relaxed text-base md:text-lg
                [&>p]:mb-6 [&>p]:text-[#586064]
                [&>h2]:font-[Noto_Serif] [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:text-[#2b3437] [&>h2]:mt-14 [&>h2]:mb-6
                [&>h3]:font-[Noto_Serif] [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#2b3437] [&>h3]:mt-10 [&>h3]:mb-4
                [&>ul]:mb-6 [&>ul]:pl-6 [&>ul>li]:mb-3 [&>ul>li]:text-[#586064] [&>ul>li]:list-disc
                [&>ol]:mb-6 [&>ol]:pl-6 [&>ol>li]:mb-4 [&>ol>li]:text-[#586064] [&>ol>li]:list-decimal
                [&>blockquote]:border-l-4 [&>blockquote]:border-[#506072] [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:my-10 [&>blockquote]:italic [&>blockquote]:text-[#506072] [&>blockquote]:bg-[#d3e4fa]/20 [&>blockquote]:rounded-r-lg
                [&>strong]:text-[#2b3437] [&>strong]:font-bold
                [&>img]:rounded-xl [&>img]:w-full [&>img]:my-8
              "
              dangerouslySetInnerHTML={{ __html: konten || '' }}
            />
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="sticky top-32 space-y-8">

              {/* About card */}
              <div className="bg-white p-8 rounded-xl"
                style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>
                <h4 className="font-[Manrope] text-xs tracking-widest text-[#506072] uppercase mb-6">
                  {lang === 'id' ? 'Kurator Konten' : 'Content Curator'}
                </h4>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 outline outline-offset-4 outline-[#abb3b7]/30">
                    <img
                      alt="Author"
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
                    />
                  </div>
                  <h3 className="font-[Noto_Serif] text-lg text-[#2b3437] mb-2">
                    {lang === 'id' ? 'Tim Beautifulnesia' : 'Beautifulnesia Team'}
                  </h3>
                  <p className="font-[Manrope] text-sm text-[#586064] leading-relaxed">
                    {lang === 'id'
                      ? 'Panduan jujur tanpa filter sponsor untuk perjalananmu yang lebih bermakna.'
                      : 'Honest guides without sponsor filters for a more meaningful journey.'}
                  </p>
                  <div className="mt-8 pt-6 border-t border-[#f1f4f6] flex justify-center gap-5 text-[#586064]">
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#506072] transition-colors">share</span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#506072] transition-colors">mail</span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-[#506072] transition-colors">public</span>
                  </div>
                </div>
              </div>

              {/* Back button */}
              <Link
                href={`/${lang}`}
                className="flex items-center gap-2 text-sm font-[Manrope] font-bold uppercase tracking-widest text-[#506072] hover:text-[#2b3437] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
              </Link>

            </div>
          </aside>

        </div>
      </div>

    </main>
  )
}