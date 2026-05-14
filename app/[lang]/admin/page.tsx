import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  const { data: artikelList } = await supabase
    .from('artikel')
    .select('id, judul_id, judul_en, kategori, published, created_at, slug')
    .order('created_at', { ascending: false })

  return (
    <main className="bg-[#f8f9fa] min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-[#dbe4e7]"
        style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>
        <div className="max-w-[1440px] mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="font-[Manrope] text-xs tracking-[0.2em] text-[#506072] uppercase mb-1 block">
              Admin Panel
            </span>
            <h1 className="font-[Noto_Serif] text-3xl md:text-4xl font-bold text-[#2b3437]">
              Dashboard
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/${lang}`}
              className="border border-[#dbe4e7] text-[#506072] px-5 py-3 rounded font-[Manrope] font-bold text-xs uppercase tracking-widest hover:bg-[#f1f4f6] transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Lihat Website
            </Link>
            <Link
              href={`/${lang}/admin/tulis`}
              className="bg-[#506072] text-white px-5 py-3 rounded font-[Manrope] font-bold text-xs uppercase tracking-widest hover:bg-[#445465] transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Artikel Baru
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-12">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Artikel', value: artikelList?.length ?? 0, icon: 'article' },
            { label: 'Dipublikasikan', value: artikelList?.filter(a => a.published).length ?? 0, icon: 'public' },
            { label: 'Draft', value: artikelList?.filter(a => !a.published).length ?? 0, icon: 'draft' },
            { label: 'Kategori', value: [...new Set(artikelList?.map(a => a.kategori))].length ?? 0, icon: 'category' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6"
              style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>
              <div className="flex items-start justify-between mb-4">
                <span className="material-symbols-outlined text-[#506072]">{stat.icon}</span>
              </div>
              <p className="font-[Noto_Serif] text-3xl font-bold text-[#2b3437] mb-1">{stat.value}</p>
              <p className="font-[Manrope] text-xs uppercase tracking-widest text-[#586064]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Article Table */}
        <div className="bg-white rounded-xl overflow-hidden"
          style={{ boxShadow: '0 20px 40px rgba(43,52,55,0.06)' }}>

          <div className="px-8 py-6 border-b border-[#f1f4f6] flex justify-between items-center">
            <h2 className="font-[Noto_Serif] text-xl font-bold text-[#2b3437]">Semua Artikel</h2>
          </div>

          {artikelList && artikelList.length > 0 ? (
            <>
              {/* Desktop Table */}
              <table className="w-full text-sm hidden md:table">
                <thead className="bg-[#f8f9fa]">
                  <tr>
                    <th className="text-left px-8 py-4 font-[Manrope] text-[10px] uppercase tracking-widest text-[#586064] font-bold">Judul</th>
                    <th className="text-left px-6 py-4 font-[Manrope] text-[10px] uppercase tracking-widest text-[#586064] font-bold">Kategori</th>
                    <th className="text-left px-6 py-4 font-[Manrope] text-[10px] uppercase tracking-widest text-[#586064] font-bold">Tanggal</th>
                    <th className="text-left px-6 py-4 font-[Manrope] text-[10px] uppercase tracking-widest text-[#586064] font-bold">Status</th>
                    <th className="text-left px-6 py-4 font-[Manrope] text-[10px] uppercase tracking-widest text-[#586064] font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8f9fa]">
                  {artikelList.map(artikel => (
                    <tr key={artikel.id} className="hover:bg-[#f8f9fa] transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-[Noto_Serif] font-bold text-[#2b3437] truncate max-w-xs group-hover:text-[#506072] transition-colors">
                          {artikel.judul_id}
                        </p>
                        <p className="font-[Manrope] text-xs text-[#abb3b7] mt-1 truncate max-w-xs">
                          {artikel.judul_en}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-block px-3 py-1 bg-[#d3e4fa] text-[#435365] font-[Manrope] text-[10px] tracking-widest uppercase rounded">
                          {artikel.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-[Manrope] text-xs text-[#586064]">
                        {new Date(artikel.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] px-3 py-1 rounded font-[Manrope] font-bold uppercase tracking-wide ${
                          artikel.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {artikel.published ? 'Publik' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/${lang}/admin/tulis?id=${artikel.id}`}
                            className="font-[Manrope] text-[#506072] hover:text-[#2b3437] font-bold text-xs uppercase tracking-widest transition-colors"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/${lang}/artikel/${artikel.slug}`}
                            target="_blank"
                            className="font-[Manrope] text-[#abb3b7] hover:text-[#506072] font-bold text-xs uppercase tracking-widest transition-colors"
                          >
                            Lihat
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile List */}
              <div className="md:hidden divide-y divide-[#f8f9fa]">
                {artikelList.map(artikel => (
                  <div key={artikel.id} className="px-6 py-5 flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-[Noto_Serif] font-bold text-[#2b3437] text-sm mb-1 truncate">
                        {artikel.judul_id}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 bg-[#d3e4fa] text-[#435365] rounded font-[Manrope] uppercase tracking-wide">
                          {artikel.kategori}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-[Manrope] font-bold uppercase ${
                          artikel.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {artikel.published ? 'Publik' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/${lang}/admin/tulis?id=${artikel.id}`}
                      className="font-[Manrope] text-[#506072] font-bold text-xs uppercase tracking-widest flex-shrink-0"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 px-8">
              <span className="material-symbols-outlined text-5xl text-[#dbe4e7] mb-4 block">article</span>
              <p className="font-[Noto_Serif] text-xl text-[#2b3437] mb-2">Belum ada artikel</p>
              <p className="font-[Manrope] text-sm text-[#586064] mb-8">Mulai tulis artikel pertamamu sekarang</p>
              <Link
                href={`/${lang}/admin/tulis`}
                className="inline-block bg-[#506072] text-white px-8 py-3 rounded font-[Manrope] font-bold text-xs uppercase tracking-widest hover:bg-[#445465] transition-colors"
              >
                + Artikel Baru
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}