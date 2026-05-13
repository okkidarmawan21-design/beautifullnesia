import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function AdminDashboard({ params }: { params: { lang: string } }) {
  const { data: artikelList } = await supabase
    .from('artikel')
    .select('id, judul_id, judul_en, kategori, published, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-[Noto_Serif] text-3xl font-bold text-[#2b3437]">Dashboard Admin</h1>
        <Link
          href={`/${params.lang}/admin/tulis`}
          className="bg-[#506072] text-white px-6 py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#445465] transition-colors"
        >
          + Artikel Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#f1f4f6]">
            <tr>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold">Judul</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold hidden md:table-cell">Kategori</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold hidden md:table-cell">Status</th>
              <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-[#586064] font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f4f6]">
            {artikelList?.map(artikel => (
              <tr key={artikel.id} className="hover:bg-[#f8f9fa] transition-colors">
                <td className="px-6 py-4 font-medium text-[#2b3437]">{artikel.judul_id}</td>
                <td className="px-6 py-4 text-[#586064] hidden md:table-cell">{artikel.kategori}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wide ${artikel.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {artikel.published ? 'Publik' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/${params.lang}/admin/tulis?id=${artikel.id}`}
                    className="text-[#506072] hover:underline font-bold text-xs uppercase tracking-widest"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}