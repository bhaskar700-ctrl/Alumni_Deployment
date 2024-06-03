import crypto from 'crypto';

const secret = 'mysecret';
const shasum = crypto.createHmac('sha256', secret);
shasum.update('I love cupcakes');
const digest = shasum.digest('hex');

console.log('Digest:', digest);
