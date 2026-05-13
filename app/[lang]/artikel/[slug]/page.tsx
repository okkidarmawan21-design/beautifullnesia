import { supabase } from '@/lib/supabase'
import { Lang } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ArtikelDetail({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>
}) {
  const { lang, slug } = await params

  const { data: artikel } = await supabase
    .from('artikel')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!artikel) notFound()

  const judul = lang === 'id' ? artikel.judul_id : artikel.judul_en
  const konten = lang === 'id' ? artikel.konten_id : artikel.konten_en
  const otherLang = lang === 'id' ? 'en' : 'id'

  return (
    <main className="w-full">

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <nav className="flex items-center gap-2 text-sm text-[#586064] uppercase tracking-wide flex-wrap">
          <Link href={`/${lang}`} className="hover:text-[#506072] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#506072] font-bold">{artikel.kategori}</span>
        </nav>
      </div>

      {/* Header Artikel */}
      <header className="max-w-4xl mx-auto px-6 pt-8 pb-12 text-center md:text-left">
        <div className="inline-block bg-[#d3e4fa] text-[#435365] px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase rounded mb-6">
          {artikel.kategori}
        </div>
        <h1 className="font-[Noto_Serif] text-3xl md:text-5xl lg:text-6xl font-bold text-[#2b3437] leading-tight mb-8">
          {judul}
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 border-t border-[#abb3b7]/20 pt-6 justify-center md:justify-start">
          <p className="text-sm text-[#586064]">
            {new Date(artikel.created_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
          {/* Tombol ganti bahasa */}
          <Link
            href={`/${otherLang}/artikel/${slug}`}
            className="text-xs font-bold uppercase tracking-widest border border-[#506072]/30 px-3 py-1 rounded text-[#506072] hover:bg-[#506072] hover:text-white transition-all w-fit"
          >
            {otherLang === 'id' ? 'Baca dalam Indonesia' : 'Read in English'}
          </Link>
        </div>
      </header>

      {/* Gambar Hero */}
      {artikel.gambar_url && (
        <section className="w-full px-4 md:px-12 lg:px-24 mb-16">
          <div className="max-w-[1440px] mx-auto overflow-hidden rounded-xl">
            <img
              alt={judul}
              className="w-full aspect-[21/9] object-cover"
              src={artikel.gambar_url}
            />
          </div>
        </section>
      )}

      {/* Konten Artikel */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div
          className="prose prose-lg max-w-none text-[#2b3437] leading-relaxed
            prose-headings:font-[Noto_Serif] prose-headings:text-[#2b3437]
            prose-p:text-[#586064] prose-p:leading-relaxed
            prose-a:text-[#506072] prose-a:underline
            prose-blockquote:border-[#506072] prose-blockquote:text-[#586064] prose-blockquote:italic
            prose-strong:text-[#2b3437]"
          dangerouslySetInnerHTML={{ __html: konten || '' }}
        />
      </div>

      {/* Tombol Kembali */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm text-[#506072] font-bold uppercase tracking-widest hover:text-[#2b3437] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </Link>
      </div>

    </main>
  )
}
