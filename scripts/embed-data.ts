// Lokasi: scripts/embed-data.ts

import { products } from '../data/products';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ChromaClient, IEmbeddingFunction } from 'chromadb';
import { config } from 'dotenv';

config({ path: '.env.local' });

// Kelas pembantu agar LangChain bisa 'berbicara' dengan ChromaDB
class LangChainEmbeddingFunction implements IEmbeddingFunction {
    constructor(private readonly embeddings: GoogleGenerativeAIEmbeddings) {}
    public async generate(texts: string[]): Promise<number[][]> {
        return this.embeddings.embedDocuments(texts);
    }
}

// --- PUSAT PENGETAHUAN KITVERSITY ---
const knowledgeBase = [
    // Informasi Umum & FAQ
    { type: 'Info Umum', content: 'Kitversity adalah one-stop solution untuk semua kebutuhan perlengkapan mahasiswa baru di Surabaya. Kami menyediakan semua yang dibutuhkan untuk ospek dan kegiatan kampus dengan kualitas terjamin dan harga terjangkau.' },
    { type: 'Kontak', content: 'Untuk bantuan lebih lanjut, customer bisa menghubungi admin kami via WhatsApp di nomor +62 851-3570-6028 atau melalui email di admin@kitversity.com.' },
    { type: 'Pengiriman', content: 'Kami menawarkan dua metode pengiriman: 1. Ambil langsung di Kampus UNAIR (Gratis). 2. Gratis kirim ke rumah untuk seluruh area kota Surabaya.' },
    { type: 'Sistem Pemesanan', content: 'Kitversity saat ini menggunakan sistem Pre-Order (PO). Artinya, pesanan dikumpulkan terlebih dahulu dalam periode tertentu, lalu diproduksi dan dikirim serentak setelah periode PO berakhir. Info jadwal PO selalu ada di halaman utama.' },
    
    // Alur Pemesanan
    { type: 'Cara Pesan', content: 'Langkah 1: Kunjungi website www.kitversity.com.' },
    { type: 'Cara Pesan', content: 'Langkah 2: Cari dan pilih produk yang diinginkan, lalu masukkan ke keranjang.' },
    { type: 'Cara Pesan', content: 'Langkah 3: Buka halaman checkout, isi data diri lengkap (Nama, Email, WhatsApp).' },
    { type: 'Cara Pesan', content: 'Langkah 4: Pilih metode pembayaran yang tersedia, seperti Transfer Bank atau Virtual Account.' },
    { type: 'Cara Pesan', content: 'Langkah 5: Selesaikan pembayaran sesuai instruksi dan total tagihan.' },
    { type: 'Cara Pesan', content: 'Langkah 6: Lakukan konfirmasi pembayaran melalui tombol di halaman "Terima Kasih" untuk mengirim bukti ke admin via WhatsApp.' },
    
    // Metode Pembayaran
    { type: 'Pembayaran', content: 'Kami menerima pembayaran melalui Transfer Bank ke rekening BCA. Selain itu, kami juga menerima pembayaran via Virtual Account (BCA, BRI, BNI, Mandiri) yang terhubung ke ShopeePay, serta transfer langsung ke e-wallet ShopeePay dan GoPay.' },
    { type: 'Pembayaran', content: 'Untuk QRIS, fitur ini akan segera hadir dalam 1-3 hari lagi dan saat ini belum bisa digunakan.' },
];

const COLLECTION_NAME = 'kitversity_gemini_final';
const CHROMA_URL = 'http://localhost:8000';

async function main() {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY tidak ditemukan di file .env.local");
    }

    console.log('Memulai proses pembuatan "Perpustakaan Pengetahuan" untuk Kit-AI...');

    // 1. Proses Dokumen Produk
    const productDocs = products.map(product => {
        const variantsText = product.variants ? product.variants.map(v => `${v.name}: ${v.options.join(', ')}`).join('; ') : 'Produk ini tidak memiliki varian ukuran atau warna.';
        const content = `
            Informasi tentang produk "${product.name}":
            - Harga: Rp ${product.price.toLocaleString('id-ID')}.
            - Deskripsi: ${product.description}.
            - Spesifikasi: ${product.specifications || 'Tidak ada info spesifikasi tambahan.'}.
            - Varian yang tersedia: ${variantsText}.
            - Kategori: ${product.category.join(', ')}.
        `;
        return { pageContent: content.trim().replace(/\s+/g, ' '), metadata: { source: 'product', id: product.id } };
    });

    // 2. Proses Dokumen Pengetahuan Umum
    const knowledgeDocs = knowledgeBase.map(item => {
        return { pageContent: item.content, metadata: { source: 'info', type: item.type } };
    });

    const allDocs = [...productDocs, ...knowledgeDocs];

    // 3. Inisialisasi Klien ChromaDB & Model Embedding Google
    const client = new ChromaClient({ path: CHROMA_URL });
    const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: "embedding-001",
    });

    // 4. Buat atau dapatkan koleksi
    console.log(`Memastikan koleksi '${COLLECTION_NAME}' ada...`);
    const collection = await client.getOrCreateCollection({
        name: COLLECTION_NAME,
        embeddingFunction: new LangChainEmbeddingFunction(googleEmbeddings)
    });

    // 5. Hapus data lama dari koleksi (jika ada)
    const currentCount = await collection.count();
    if (currentCount > 0) {
        const allIdsToDelete = (await collection.get()).ids;
        await collection.delete({ ids: allIdsToDelete });
        console.log(`Menghapus ${currentCount} dokumen lama...`);
    }

    // 6. Tambahkan dokumen baru ke koleksi
    console.log(`Menambahkan ${allDocs.length} dokumen baru ke perpustakaan...`);
    const ids = allDocs.map((_, index) => `doc_${Date.now()}_${index}`);
    
    await collection.add({
        ids: ids,
        documents: allDocs.map(doc => doc.pageContent),
        metadatas: allDocs.map(doc => doc.metadata),
    });

    console.log('✅ Perpustakaan Pengetahuan Kit-AI berhasil dibuat!');
    console.log(`Total "buku" di dalam perpustakaan: ${await collection.count()}`);
}

main().catch(e => {
    console.error("Terjadi error fatal:", e);
    process.exit(1);
});