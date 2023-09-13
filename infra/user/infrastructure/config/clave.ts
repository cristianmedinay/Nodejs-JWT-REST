//import crypto module
import crypto from 'crypto';
//generate key pair
const { generateKeyPair } = require('crypto');
generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret'
  }
// Handle errors and use the generated key pair
}, (err: any, publicKey: any, privateKey: any) => {
  publicKey
});
//Assign key to variable
const publicKeyString = `-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEAzXlBBes4SpVk5BxPVuY+LR5+pxcjTNVzlVl4ugix3husiWPSfnYl
K+z0zmWwGRBXncVgjRb/SliBhHDKSyqJ+gvk8RU1rO7qSFK0hGTrO63EKy4fbGgz
ghO0RMi+IznBqDWldd1XeBnxVUlHhjBsYNSWdFCSh6rwNTtG2Dn8GYWpXs5AUXZn
L97WQot7cAekZA+P5iNjsAZoh74tY0+bRRLfIvKaXPFiH1I72R7Ky8F1NwBmOx0k
Lk++7OGlpDDmJuI/1d3SDmznoVWeEo1evgnCYrjGeF1QCAWe0SSRWYaDCddy2dUi
1BfUIwyMHN4OSxX6TKohAPEhkbU7dU4CUyH6oEaXddhhl427UYrtv9WY32kKnY1d
q/3ZjZ1LRE3cwPywHQichjyGMOZF6l6tPE6ZVQHlrgsT3GTaSEO8I4F5Z0eaEAqZ
iqeg9sOf9DfLdTvA5oZ9NKymnHqWndEM3gIV3KA4LP+qwVlsD/zFcuxWRHjM5r1K
XvQgrLAHqfCQ7LwhUivjCjIfp2nYFYrzlDlUUZzg1AAKxhRJIUt58o7RnS/29zon
Pur5caj1iOrhfuTvkCM4uQyampk1A5+98aOObA97jCQ7mWbn8St8Hpdqim1c2v0s
QXeyRdm8aZ5xzJ5cZ2p2NWGvGoocx4c8i9GQuHUVktQE6nuMS7aKQlECAwEAAQ==
-----END RSA PUBLIC KEY-----`;
//Use the function to create and export the public key object
const publickKeyObject = crypto.createPublicKey(publicKeyString);
export default publickKeyObject/* .export({ format: 'pem', type: 'pkcs1' });
console.log(publickKeyObject) */