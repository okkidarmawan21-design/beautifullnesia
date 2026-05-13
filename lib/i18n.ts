export const dict = {
  id: {
    nav: {
      destinations: 'Destinasi',
      guides: 'Panduan Pemula',
      reviews: 'Ulasan',
      promos: 'Promo Terkini',
    },
    home: {
      eyebrow: 'Volume 1: Nusantara',
      hero_title_1: 'Keindahan',
      hero_title_2: 'Indonesia',
      hero_subtitle: 'Dari ujung Sabang hingga Merauke, jelajahi kedalaman destinasi terbaik Nusantara dengan panduan kurasi terpercaya.',
      cta: 'Jelajahi Koleksi',
      featured: 'Destinasi Unggulan',
      latest: 'Artikel Terbaru',
      read_more: 'Baca Selengkapnya',
    },
    admin: {
      title: 'Dashboard Admin',
      new_article: 'Tulis Artikel Baru',
      logout: 'Keluar',
      judul_id: 'Judul (Indonesia)',
      judul_en: 'Judul (English)',
      slug: 'Slug (URL)',
      deskripsi_id: 'Deskripsi (Indonesia)',
      deskripsi_en: 'Deskripsi (English)',
      konten_id: 'Konten (Indonesia)',
      konten_en: 'Konten (English)',
      gambar_url: 'URL Gambar',
      kategori: 'Kategori',
      publish: 'Publikasikan',
      save_draft: 'Simpan Draft',
    }
  },
  en: {
    nav: {
      destinations: 'Destinations',
      guides: 'Beginner Guides',
      reviews: 'Reviews',
      promos: 'Latest Promos',
    },
    home: {
      eyebrow: 'Volume 1: The Archipelago',
      hero_title_1: 'Beautiful',
      hero_title_2: 'Indonesia',
      hero_subtitle: 'From the shores of Sabang to Merauke, explore Indonesia\'s most evocative landscapes through curated, honest travel writing.',
      cta: 'Discover the Collections',
      featured: 'Featured Escapes',
      latest: 'Latest Articles',
      read_more: 'Read More',
    },
    admin: {
      title: 'Admin Dashboard',
      new_article: 'Write New Article',
      logout: 'Sign Out',
      judul_id: 'Title (Indonesian)',
      judul_en: 'Title (English)',
      slug: 'Slug (URL)',
      deskripsi_id: 'Description (Indonesian)',
      deskripsi_en: 'Description (English)',
      konten_id: 'Content (Indonesian)',
      konten_en: 'Content (English)',
      gambar_url: 'Image URL',
      kategori: 'Category',
      publish: 'Publish',
      save_draft: 'Save as Draft',
    }
  }
} as const

export type Lang = keyof typeof dict