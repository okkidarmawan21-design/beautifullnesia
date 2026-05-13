import { dict, Lang } from '@/lib/i18n'
import Link from 'next/link'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Lang }>
}) {
  const { lang } = await params
  const t = dict[lang] ?? dict['id']
  const otherLang = lang === 'id' ? 'en' : 'id'

  return (
    <>
      {/* Navbar */}
      <header className="bg-[#f8f9fa]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#dbe4e7]/60">
        <nav className="flex justify-between items-center w-full px-6 md:px-8 py-4 md:py-6 max-w-[1440px] mx-auto">

          {/* Logo */}
          <Link href={`/${lang}`} className="font-[Noto_Serif] text-xl md:text-2xl font-bold italic text-[#2b3437]">
            Beautifulnesia
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10 font-[Noto_Serif] text-base lg:text-lg tracking-tight">
            <Link href={`/${lang}`} className="text-[#506072] hover:text-[#2b3437] transition-colors">{t.nav.destinations}</Link>
            <Link href={`/${lang}`} className="text-[#506072]/60 hover:text-[#2b3437] transition-colors">{t.nav.guides}</Link>
            <Link href={`/${lang}`} className="text-[#506072]/60 hover:text-[#2b3437] transition-colors">{t.nav.reviews}</Link>
            <Link href={`/${lang}`} className="text-[#506072]/60 hover:text-[#2b3437] transition-colors">{t.nav.promos}</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 text-[#506072]">
            {/* Language Toggle */}
            <Link
              href={`/${otherLang}`}
              className="font-[Manrope] text-xs font-bold tracking-widest uppercase border border-[#506072]/30 px-3 py-1 rounded hover:bg-[#506072] hover:text-white transition-all"
            >
              {otherLang.toUpperCase()}
            </Link>
            <span className="material-symbols-outlined cursor-pointer hover:text-[#2b3437] transition-colors text-[22px]">search</span>
            <Link href={`/${lang}/admin`}>
              <span className="material-symbols-outlined cursor-pointer hover:text-[#2b3437] transition-colors text-[22px]">account_circle</span>
            </Link>
            {/* Mobile Hamburger */}
            <span className="material-symbols-outlined md:hidden cursor-pointer text-[22px]">menu</span>
          </div>
        </nav>
      </header>

      {/* Konten Halaman */}
      {children}

      {/* Footer */}
      <footer className="bg-[#f1f4f6] pt-16 pb-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="space-y-4">
            <div className="font-[Noto_Serif] text-xl font-bold text-[#2b3437]">Beautifulnesia</div>
            <p className="text-sm text-[#506072] leading-relaxed max-w-xs">
              {lang === 'id'
                ? 'Platform editorial perjalanan independen yang menghadirkan panduan jujur dan mendalam tentang keindahan Indonesia.'
                : 'An independent travel editorial platform delivering honest, in-depth guides to the beauty of Indonesia.'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#2b3437] mb-5">Explore</h4>
            <ul className="space-y-3 text-sm text-[#506072]">
              {['Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Bali', 'Papua'].map(d => (
                <li key={d}><Link href={`/${lang}`} className="hover:underline">{d}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#2b3437] mb-5">Connect</h4>
            <div className="flex gap-5 text-[#506072]">
              <Link href="#" className="flex flex-col items-center gap-1 hover:text-[#2b3437] transition-colors">
                <span className="material-symbols-outlined text-2xl">camera</span>
                <span className="text-[10px] tracking-widest uppercase">Instagram</span>
              </Link>
              <Link href="#" className="flex flex-col items-center gap-1 hover:text-[#2b3437] transition-colors">
                <span className="material-symbols-outlined text-2xl">smart_display</span>
                <span className="text-[10px] tracking-widest uppercase">YouTube</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-[#abb3b7]/20 pt-6 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#506072]/50">© 2024 Beautifulnesia. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
