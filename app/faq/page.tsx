'use client';

import { useState } from 'react';
import { ChevronDown, Search, MessageCircle, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqCategories = [
  {
    id: 'general',
    name: 'Umum',
    icon: ShoppingBag,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'payment',
    name: 'Pembayaran',
    icon: CreditCard,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'shipping',
    name: 'Pengiriman',
    icon: Truck,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 'product',
    name: 'Produk',
    icon: MessageCircle,
    color: 'bg-purple-100 text-purple-600'
  }
];

const faqData = [
  {
    id: '1',
    category: 'general',
    question: 'Apa itu kitversity?',
    answer: 'Kitversity adalah toko online yang menyediakan semua kebutuhan pelajar dan mahasiswa baru, khususnya di area Surabaya. Kami menyediakan berbagai produk mulai dari alat tulis, pakaian, buku, hingga aksesoris dengan kualitas terbaik dan harga terjangkau.'
  },
  {
    id: '2',
    category: 'general',
    question: 'Apakah Kitversity hanya melayani mahasiswa di Surabaya?',
    answer: 'Untuk saat ini, Kitversity hanya melayani mahasiswa Kampus Surabaya, namun tidak menutup kemungkinan ke depannya akan menjangkau dan melayani pelajar dari berbagai daerah.'
  },
  {
    id: '3',
    category: 'payment',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Kami menyediakan dua metode pembayaran yaitu melalui transfer bank dan juga QRIS (M-Banking dan E-Wallet)'
  },
  {
    id: '4',
    category: 'payment',
    question: 'Apakah pembayaran di Kitversity aman?',
    answer: 'Ya, sangat aman! Kami menggunakan sistem pembayaran dengan alamat rekening tim kami, pembeli juga dapat bertanya untuk lebih lanjut melalui Whatsapp admin atau pun pada grup khusus para pembeli.'
  },
  {
    id: '5',
    category: 'general',
    question: 'Bagaimana sistem pembelian produk Kitversity?',
    answer: 'Sesuai dengan informasi yang tertera baik dalam website ini dan laman official @Kitversity, kami menerapkan sistem Pre Order atau Open PO. Jadi, kami membuka Open Pre Order mulai dari tanggal 01 Juli — 12 Juli, dan tim kami akan selalu update mengenai berbagai informasi pada grup whatsapp para pembeli.'
  },
  {
    id: '6',
    category: 'shipping',
    question: 'Kapan produk akan dikirim atau diberikan?',
    answer: 'Setelah Open Pre Order ditutup, tim kami langsung menyiapkan produk yang dibeli, kami akan memberi pelayanan terbaik, mulai dari kualitas produk, packaging, hingga pengiriman. Untuk pengiriman sendiri kami menyediakan dua opsi, yaitu pelayanan siap antar tanpa biaya (Gratis Ongkos Kirim) dan juga pengambilan produk oleh pembeli di Kampus UNAIR (Info selanjutnya akan disampaikan di grup).'
  },
  {
    id: '7',
    category: 'shipping',
    question: 'Apakah ada gratis ongkir?',
    answer: 'Ya! Kami memberikan gratis ongkir untuk pengiriman ke area Surabaya dan Kampus UNAIR tanpa minimum pembelian. Semua pesanan di area tersebut akan mendapatkan gratis ongkir.'
  },
  {
    id: '8',
    category: 'general',
    question: 'Bagaimana saya bisa tahu proses dan progres dari pesanan saya?',
    answer: 'Tim Kitversity akan selalu update mengenai berbagai informasi pada grup khusus para pembeli, di grup tersebut tim akan dapat berinteraksi langsung dan dapat bertanya tentang apapun.'
  },
  {
    id: '9',
    category: 'product',
    question: 'Apakah produk di Kitversity berkualitas?',
    answer: 'Tentu saja! Semua produk yang kami jual telah melalui quality control ketat. Kami bekerja sama dengan supplier terpercaya dan memberikan garansi untuk produk-produk tertentu sesuai dengan ketentuan pabrik.'
  },
  {
    id: '10',
    category: 'product',
    question: 'Bagaimana jika produk yang saya terima rusak atau tidak sesuai?',
    answer: 'Apabila produk yang diterima oleh pembeli rusak atau tidak sesuai, tim Kitversity akan bertanggung jawab untuk mengganti dengan produk yang sesuai atau bahkan mengganti kerugian dengan pengembalian dana, dengan syarat pembeli wajib melampirkan bukti pendukung, seperti video unboxing produk.'
  },
  {
    id: '11',
    category: 'general',
    question: 'Bagaimana cara menghubungi customer service?',
    answer: 'Cara tercepat adalah melalui WhatsApp di +62 851-3570-6028. Tim kami aktif 24/7 dan akan merespon dengan cepat. Anda juga bisa mengirim email ke admin@kitversity.com atau menggunakan layanan Chatbot AI yang telah kami latih untuk dapat melayani customer dengan sebaik mungkin.'
  }
];


export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppClick = () => {
    const message = 'Halo! Saya tidak menemukan jawaban yang saya cari di FAQ. Bisa bantu saya?';
    const whatsappUrl = `https://wa.me/6285135706028?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Temukan jawaban untuk pertanyaan yang sering diajukan. Jika tidak menemukan jawaban yang Anda cari, 
            jangan ragu untuk menghubungi tim customer service kami.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="rounded-full"
          >
            Semua Kategori
          </Button>
          {faqCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* FAQ Items */}
          {filteredFAQs.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm">
              <Accordion type="single" collapsible className="p-6">
                {filteredFAQs.map((faq) => {
                  const category = faqCategories.find(cat => cat.id === faq.category);
                  const Icon = category?.icon || MessageCircle;
                  
                  return (
                    <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${category?.color} flex-shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-semibold text-gray-900 text-lg">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="ml-16">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak Ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                Tidak ada FAQ yang cocok dengan pencarian Anda.
              </p>
              <Button onClick={() => setSearchQuery('')}>
                Reset Pencarian
              </Button>
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Masih Ada Pertanyaan?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Tim customer service kami siap membantu Anda 24/7. 
              Jangan ragu untuk menghubungi kami jika Anda membutuhkan bantuan lebih lanjut.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat WhatsApp
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="text-blue-600 border-white hover:bg-white hover:text-blue-700"
                size="lg"
              >
                <a href="mailto:admin@kitversity.com">
                  Kirim Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}