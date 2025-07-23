const handleConfirmPayment = () => {
    // 1. Pastikan ada data order, jika tidak, hentikan fungsi.
    if (!order) {
        toast({
            title: "Error",
            description: "Data pesanan tidak ditemukan untuk membuat pesan konfirmasi.",
            variant: "destructive",
        });
        return;
    }

    try {
        // 2. Siapkan data dengan aman, berikan nilai default jika ada yang kosong.
        const customerName = order.customerInfo?.name || 'Nama Tidak Tersedia';
        const customerEmail = order.customerInfo?.email || 'Email Tidak Tersedia';
        const customerPhone = order.customerInfo?.phone || 'No. HP Tidak Tersedia';

        const paymentMethodText = order.paymentMethod
            ? order.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            : 'Metode Tidak Diketahui';

        const orderDate = order.createdAt 
            ? new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) 
            : 'Tanggal Tidak Tersedia';
        
        const totalAmountFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.totalAmount || 0);

        // 3. Proses rincian item dengan lebih aman.
        const itemDetails = order.items.map(item => {
            let variantText = '';
            if (item.product_details) {
                try {
                    const variants = JSON.parse(item.product_details);
                    // Tambahan pengecekan untuk memastikan 'variants' adalah objek
                    if (variants && typeof variants === 'object' && !Array.isArray(variants)) {
                       variantText = ` (${Object.entries(variants).map(([key, value]) => `${key}: ${String(value)}`).join(', ')})`;
                    }
                } catch (e) {
                    // Jika parsing gagal, abaikan saja, tidak akan membuat error
                    console.error("Gagal parse product_details:", item.product_details, e);
                }
            }
            const subtotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((item.price || 0) * (item.quantity || 1));
            return `- ${item.name || 'Nama Produk Error'}${variantText} (Qty: ${item.quantity || 1}) - ${subtotal}`;
        }).join('\n');

        // 4. Buat pesan WhatsApp
        const message = `*KONFIRMASI PEMBAYARAN - KITVERSITY*

Halo Admin, saya ingin mengonfirmasi pembayaran untuk pesanan berikut:
-----------------------------------
*ID Pesanan:* ${order.id}
*Tanggal:* ${orderDate}
-----------------------------------

*DATA PEMBELI:*
- *Nama:* ${customerName}
- *Email:* ${customerEmail}
- *No. WhatsApp:* ${customerPhone}

*RINCIAN PESANAN:*
${itemDetails}

*METODE PEMBAYARAN:*
${paymentMethodText}

*TOTAL PEMBAYARAN:*
*${totalAmountFormatted}*
-----------------------------------

Berikut saya lampirkan bukti pembayarannya.
Terima kasih!`;

        // 5. Buka link WhatsApp
        const whatsappUrl = `https://wa.me/6285135706028?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

    } catch (error) {
        // Jika masih ada error yang tidak terduga, tampilkan pesan
        console.error("Gagal membuat pesan WhatsApp:", error);
        toast({
            title: "Oops!",
            description: "Gagal membuat pesan konfirmasi. Silakan hubungi admin secara manual.",
            variant: "destructive",
        });
    }
};