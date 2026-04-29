import bcrypt from 'bcrypt';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.js <plain-password>');
  process.exit(1);
}

const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);

console.log(hash);
