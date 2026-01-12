const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node generate-hash.js <password>');
  console.log('Example: node generate-hash.js MySecurePassword123');
  process.exit(1);
}

async function hashPassword() {
  const hash = await bcrypt.hash(password, 10);
  console.log('HASH:', hash);
}

hashPassword();
