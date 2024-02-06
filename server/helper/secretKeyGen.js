import crypto from 'crypto';
const secret1 = crypto.randomBytes(64).toString('hex');
const secret2 = crypto.randomBytes(64).toString('hex');
console.table([secret1, secret2])