// Lokasi: scripts/embed-data.ts

import { products } from '../data/products';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'; // <-- PERUBAHAN DI SINI
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Document } from 'langchain/document';
import { config } from 'dotenv';

// Muat variabel environment dari .env.local
config({ path: '.env.local' });

// Data FAQ dan Informasi Lain
const otherKnowledge = [
  { page: 'FAQ', question: 'Apa itu Kitversity?', answer: 'Kitversity adalah toko online yang menyediakan semua kebutuhan pelajar dan mahasiswa baru, khususnya di area Surabaya.' },
  { page: 'FAQ', question: 'Metode pembayaran apa saja yang tersedia?', answer: 'Kami menyediakan pembayaran via Transfer Bank BCA, Virtual Account (BCA, BRI, BNI, Mandiri), dan transfer langsung ke e-wallet (ShopeePay & GoPay).' },
  { page: 'FAQ', question: 'Kapan produk akan dikirim?', answer: 'Kitversity menerapkan sistem Pre-Order dari 1-12 Juli. Setelah periode PO ditutup, tim akan menyiapkan dan mengirimkan produk. Info detail akan disampaikan di grup WhatsApp.' },
  { page: 'Pengiriman', question: 'Opsi pengiriman', answer: 'Kami menyediakan dua opsi: Ambil di Kampus UNAIR (Gratis) atau Gratis Kirim ke Rumah (khusus area kota Surabaya).' },
  { page: 'Kontak', question: 'Cara menghubungi admin', answer: 'Anda bisa menghubungi admin melalui WhatsApp di +62 851-3570-6028 atau email ke admin@kitversity.com.' }
];

async function main() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY tidak ditemukan di file .env.local");
  }

  console.log('Memulai proses pembuatan database pengetahuan untuk Kit-AI dengan Google Gemini...');

  const productDocs = products.map(product => {
    const content = `Nama Produk: ${product.name}, Harga: Rp ${product.price.toLocaleString('id-ID')}, Kategori: ${product.category.join(', ')}, Deskripsi: ${product.description}`;
    return new Document({ pageContent: content, metadata: { type: 'product', id: product.id, name: product.name } });
  });

  const otherDocs = otherKnowledge.map(item => {
    const content = `Pertanyaan: ${item.question}\nJawaban: ${item.answer}`;
    return new Document({ pageContent: content, metadata: { type: 'info', page: item.page } });
  });

  const allDocs = [...productDocs, ...otherDocs];
  console.log(`Total dokumen yang akan diproses: ${allDocs.length}`);

  // --- MENGGUNAKAN EMBEDDING DARI GOOGLE ---
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "embedding-001", // Model embedding dari Google
  });

  // Hapus koleksi lama jika ada untuk memastikan kebersihan data
  const chroma = new Chroma(embeddings, {
    collectionName: 'kitversity_knowledge_gemini',
    url: 'http://localhost:8000'
  });
  try {
      await chroma.deleteCollection();
      console.log('Koleksi lama berhasil dihapus.');
  } catch (e) {
      console.log('Tidak ada koleksi lama, membuat yang baru.');
  }

  // Buat Vector Store baru
  await Chroma.fromDocuments(allDocs, embeddings, {
    collectionName: 'kitversity_knowledge_gemini',
    url: 'http://localhost:8000'
  });

  console.log('✅ Database pengetahuan Kit-AI (Gemini) berhasil dibuat!');
}

main().catch(console.error);