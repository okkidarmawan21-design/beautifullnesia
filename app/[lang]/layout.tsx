import { dict, Lang } from '@/lib/i18n'
import Link from 'next/link'

const PULAU = ['Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Bali & NTT', 'Papua']
const DURASI = ['Weekend (2-3 hari)', 'Seminggu (5-7 hari)', 'Long trip (10+ hari)']
const JENIS  = ['Solo', 'Keluarga', 'Honeymoon', 'Backpacker']

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: langRaw } = await params
  const lang = (langRaw === 'en' ? 'en' : 'id') as Lang
  const t = dict[lang]
  const otherLang = lang === 'id' ? 'en' : 'id'

  return (
    <>
      <style>{`
        .nav-dropdown { position: relative; }
        .nav-dropdown:hover .dropdown-menu { display: block; }
        .dropdown-menu {
          display: none;
          position: absolute;
          top: calc(100% + 1px);
          left: 0;
          background: #ffffff;
          border: 0.5px solid #dbe4e7;
          box-shadow: 0 16px 40px rgba(43,52,55,0.10);
          min-width: 220px;
          z-index: 100;
          padding: 8px 0;
        }
        .dropdown-menu a {
          display: block;
          padding: 9px 20px;
          font-family: Manrope, sans-serif;
          font-size: 13px;
          color: #586064;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .dropdown-menu a:hover { background: #f1f4f6; color: #2b3437; }
        .dropdown-label {
          padding: 10px 20px 4px;
          font-family: Manrope, sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #abb3b7;
        }
        .dropdown-divider { height: 0.5px; background: #dbe4e7; margin: 6px 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="bg-[#f8f9fa]/90 backdrop-blur-xl sticky top-0 z-50 border-b border-[#dbe4e7]/60">
        <nav className="flex justify-between items-center w-full px-8 py-5 max-w-[1440px] mx-auto">

          {/* Logo — klik 5x untuk akses admin */}
          <span id="secret-logo"
            className="font-[Noto_Serif] text-xl md:text-2xl font-bold italic text-[#2b3437] cursor-pointer select-none">
            Beautifulnesia
          </span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">

            {/* Destinasi — dropdown pulau */}
            <div className="nav-dropdown">
              <button className="font-[Noto_Serif] text-base text-[#506072] hover:text-[#2b3437] transition-colors flex items-center gap-1 pb-0.5 border-b border-[#506072]">
                {t.nav.destinations}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5">
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-label">{lang === 'id' ? 'Berdasarkan Pulau' : 'By Island'}</div>
                {PULAU.map(p => (
                  <Link
                    key={p}
                    href={`/${lang}/artikel?pulau=${encodeURIComponent(p)}`}
                  >
                    {p}
                  </Link>
                ))}
                <div className="dropdown-divider" />
                <Link href={`/${lang}/artikel?kategori=Destinasi`}
                  style={{ color: '#506072', fontWeight: 600 }}>
                  {lang === 'id' ? 'Lihat Semua Destinasi →' : 'View All Destinations →'}
                </Link>
              </div>
            </div>

            {/* Itinerary — dropdown durasi & jenis */}
            <div className="nav-dropdown">
              <button className="font-[Noto_Serif] text-base text-[#506072]/60 hover:text-[#2b3437] transition-colors flex items-center gap-1">
                {t.nav.itinerary}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5">
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-label">{lang === 'id' ? 'Durasi Perjalanan' : 'Trip Duration'}</div>
                {DURASI.map(d => (
                  <Link
                    key={d}
                    href={`/${lang}/artikel?kategori=Itinerary&durasi=${encodeURIComponent(d)}`}
                  >
                    {d}
                  </Link>
                ))}
                <div className="dropdown-divider" />
                <div className="dropdown-label">{lang === 'id' ? 'Jenis Trip' : 'Trip Type'}</div>
                {JENIS.map(j => (
                  <Link
                    key={j}
                    href={`/${lang}/artikel?kategori=Itinerary&jenis=${encodeURIComponent(j)}`}
                  >
                    {j}
                  </Link>
                ))}
                <div className="dropdown-divider" />
                <Link href={`/${lang}/artikel?kategori=Itinerary`}
                  style={{ color: '#506072', fontWeight: 600 }}>
                  {lang === 'id' ? 'Lihat Semua Itinerary →' : 'View All Itineraries →'}
                </Link>
              </div>
            </div>

            {/* Tips & Budget — langsung ke filter */}
            <Link
              href={`/${lang}/artikel?kategori=Tips`}
              className="font-[Noto_Serif] text-base text-[#506072]/60 hover:text-[#2b3437] transition-colors"
            >
              {t.nav.tips}
            </Link>

          </div>

          {/* Kanan */}
          <div className="flex items-center gap-5 text-[#506072]">
            <Link
              href={`/${otherLang}`}
              className="font-[Manrope] text-xs font-bold tracking-widest uppercase border border-[#506072]/30 px-3 py-1.5 hover:bg-[#506072] hover:text-white transition-all duration-200"
            >
              {otherLang.toUpperCase()}
            </Link>
            <Link href={`/${lang}/artikel`}>
              <span className="material-symbols-outlined cursor-pointer hover:text-[#2b3437] transition-colors text-[22px]">search</span>
            </Link>
            {/* Mobile menu */}
            <span className="material-symbols-outlined md:hidden cursor-pointer text-[22px]">menu</span>
          </div>

        </nav>

        {/* Mobile nav — scroll horizontal */}
        <div className="md:hidden border-t border-[#dbe4e7]/50 px-8 py-3 flex gap-6 overflow-x-auto no-scrollbar">
          <Link href={`/${lang}/artikel?kategori=Destinasi`}
            className="font-[Noto_Serif] text-sm text-[#506072] whitespace-nowrap">
            {t.nav.destinations}
          </Link>
          <Link href={`/${lang}/artikel?kategori=Itinerary`}
            className="font-[Noto_Serif] text-sm text-[#506072]/60 whitespace-nowrap">
            {t.nav.itinerary}
          </Link>
          <Link href={`/${lang}/artikel?kategori=Tips`}
            className="font-[Noto_Serif] text-sm text-[#506072]/60 whitespace-nowrap">
            {t.nav.tips}
          </Link>
          {PULAU.map(p => (
            <Link key={p} href={`/${lang}/artikel?pulau=${encodeURIComponent(p)}`}
              className="font-[Manrope] text-sm text-[#abb3b7] whitespace-nowrap">
              {p}
            </Link>
          ))}
        </div>
      </header>

      {children}

      {/* ── FOOTER ── */}
      <footer className="bg-[#2b3437] pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 md:px-12 max-w-[1440px] mx-auto">
          <div className="space-y-5">
            <div className="font-[Noto_Serif] text-xl font-bold italic text-[#f8f9fa]">Beautifulnesia</div>
            <p className="font-[Manrope] text-sm text-[#abb3b7] leading-relaxed max-w-xs">
              {lang === 'id'
                ? 'Referensi perjalanan independen yang menghadirkan ulasan menyeluruh tentang setiap sudut keindahan Indonesia.'
                : 'An independent travel reference providing comprehensive insights into every corner of Indonesian beauty.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-6 h-px bg-[#506072]" />
              <span className="font-[Manrope] text-[10px] tracking-[0.3em] text-[#586064] uppercase">Since 2024</span>
            </div>
          </div>
          <div>
            <h4 className="font-[Manrope] text-xs font-bold uppercase tracking-widest text-[#f8f9fa] mb-6">
              {lang === 'id' ? 'Jelajahi' : 'Explore'}
            </h4>
            <ul className="space-y-3 font-[Manrope] text-sm text-[#abb3b7]">
              {PULAU.map(p => (
                <li key={p}>
                  <Link href={`/${lang}/artikel?pulau=${encodeURIComponent(p)}`}
                    className="hover:text-[#f8f9fa] transition-colors">{p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-[Manrope] text-xs font-bold uppercase tracking-widest text-[#f8f9fa] mb-6">Connect</h4>
            <div className="flex gap-5">
              {[{ icon: 'camera', label: 'Instagram' }, { icon: 'smart_display', label: 'YouTube' }, { icon: 'public', label: 'Website' }].map(s => (
                <Link key={s.label} href="#"
                  className="flex flex-col items-center gap-2 text-[#abb3b7] hover:text-[#f8f9fa] transition-colors group">
                  <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{s.icon}</span>
                  <span className="font-[Manrope] text-[10px] tracking-widest uppercase">{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-[#506072]/20 pt-8 px-8 md:px-12 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-[Manrope] text-[10px] tracking-[0.3em] uppercase text-[#586064]">
            © 2024 Beautifulnesia. All rights reserved.
          </p>
          <div className="flex gap-6 font-[Manrope] text-xs text-[#586064]">
            <Link href={`/${lang}`} className="hover:text-[#abb3b7] transition-colors">Privacy Policy</Link>
            <Link href={`/${lang}`} className="hover:text-[#abb3b7] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

      {/* Secret admin — klik logo 5x dalam 3 detik */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var el=document.getElementById('secret-logo'),c=0,t;
          if(!el)return;
          el.addEventListener('click',function(){
            c++;clearTimeout(t);
            t=setTimeout(function(){c=0;},3000);
            if(c>=5){c=0;window.location.href='/${lang}/admin/login';}
          });
        })();
      `}} />
    </>
  )
}
