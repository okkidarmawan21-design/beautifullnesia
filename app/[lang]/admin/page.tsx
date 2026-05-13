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
    .select('id, judul_id, judul_en, kategori, published, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <h1 className="font-[Noto_Serif] text-3xl font-bold text-[#2b3437]">Dashboard Admin</h1>
        <div className="flex gap-3">
          <Link
            href={`/${lang}/admin/tulis`}
            className="bg-[#506072] text-white px-6 py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#445465] transition-colors"
          >
            + Artikel Baru
          </Link>
          <Link
            href={`/${lang}`}
            className="border border-[#abb3b7] text-[#506072] px-6 py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#f1f4f6] transition-colors"
          >
            Lihat Website
          </Link>
        </div>
      </div>

      {artikelList && artikelList.length > 0 ? (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <table className="w-full text-sm hidden md:table">
            <thead className="bg-[#f1f4f6]">
              <tr>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold">Judul</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold">Kategori</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold">Tanggal</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold">Status</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f6]">
              {artikelList.map(artikel => (
                <tr key={artikel.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#2b3437] max-w-xs truncate">{artikel.judul_id}</td>
                  <td className="px-6 py-4 text-[#586064]">{artikel.kategori}</td>
                  <td className="px-6 py-4 text-[#586064] text-xs">
                    {new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wide ${
                      artikel.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {artikel.published ? 'Publik' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/${lang}/admin/tulis?id=${artikel.id}`}
                      className="text-[#506072] hover:underline font-bold text-xs uppercase tracking-widest"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile List */}
          <div className="md:hidden divide-y divide-[#f1f4f6]">
            {artikelList.map(artikel => (
              <div key={artikel.id} className="px-6 py-4 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium text-[#2b3437] text-sm mb-1 line-clamp-2">{artikel.judul_id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#586064]">{artikel.kategori}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      artikel.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {artikel.published ? 'Publik' : 'Draft'}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/${lang}/admin/tulis?id=${artikel.id}`}
                  className="text-[#506072] font-bold text-xs uppercase tracking-widest flex-shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-[#586064] italic mb-6">Belum ada artikel. Mulai tulis sekarang!</p>
          <Link
            href={`/${lang}/admin/tulis`}
            className="bg-[#506072] text-white px-8 py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#445465] transition-colors"
          >
            + Artikel Baru
          </Link>
        </div>
      )}
    </main>
  )
}
