import { createTables } from '../lib/db/schema';
import { ProductModel, UserModel } from '../lib/db/models';

async function initializeDatabase() {
  try {
    console.log('Creating database tables...');
    await createTables();
    console.log('Database tables created successfully');

    // Tambahkan data awal untuk testing
    console.log('Adding initial data...');

    // Tambah user admin
    const admin = await UserModel.create({
      name: 'Admin Kitversity',
      email: 'admin@kitversity.com',
      phone: '081234567890',
      university: 'Universitas Airlangga',
      address: 'Surabaya',
      role: 'admin'
    });
    if (admin) {
      console.log('Admin user created:', admin.email);
      } else { 
        console.log('Failed to create admin user');
      }

    // Tambah beberapa produk
    const products = [
      {
        name: 'Tas Ransel Kampus',
        description: 'Tas ransel kampus berkualitas tinggi dengan banyak kompartemen',
        price: 299000,
        stock: 50,
        image_url: '/products/backpack.jpg',
        category: 'Tas'
      },
      {
        name: 'Alat Tulis Set',
        description: 'Set alat tulis lengkap untuk mahasiswa',
        price: 150000,
        stock: 100,
        image_url: '/products/stationery.jpg',
        category: 'Alat Tulis'
      },
      {
        name: 'Laptop Stand',
        description: 'Stand laptop ergonomis untuk kenyamanan belajar',
        price: 199000,
        stock: 30,
        image_url: '/products/laptop-stand.jpg',
        category: 'Elektronik'
      }
    ];

    for (const product of products) {
      const createdProduct = await ProductModel.create(product);
      if (createdProduct) {
        console.log('Product created:', createdProduct.name);
      } else{
        console.log("Failed to create product", product.name);
      }
      }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Jalankan inisialisasi
initializeDatabase(); 