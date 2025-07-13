const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("--- Password Hash Generator untuk Kitversity Admin ---");
rl.question('Masukkan password baru yang Anda inginkan: ', (password) => {
  if (!password) {
    console.error("Password tidak boleh kosong.");
    rl.close();
    return;
  }

  // Generate hash dari password
  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      console.error("Terjadi error saat membuat hash:", err);
    } else {
      console.log("\n============================================================");
      console.log("Password Hash Anda (siap untuk disalin ke database):");
      console.log(hash);
      console.log("============================================================");
    }
    rl.close();
  });
});