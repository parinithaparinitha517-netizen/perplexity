import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  if (!password) return password;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  return bcrypt.compare(password, hashedPassword);
}
