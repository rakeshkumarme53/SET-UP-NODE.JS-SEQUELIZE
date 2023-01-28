const crypto = require('crypto');

require('dotenv').config();

var algorithm = "aes-192-cbc"; //algorithm to use
var password = process.env.CRYPTO_ENCRYPTION_CODE;
const keyLength = Number(process.env.CRYPTO_ENCRYPTION_KEY_LENGTH);
const key = crypto.scryptSync(password, 'salt', keyLength); //create key

class LinkUtils {

    static generateToken(userid) {
        var text = String(userid); //text to be encrypted
        const iv = crypto.randomBytes(16); // generate different ciphertext everytime
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex'); // encrypted text
        return iv.toString('hex') + '-' + encrypted;
    }

    static decryptToken(token) {
        let textParts = token.split('-');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        var decrypted = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
        return decrypted;
    }

}

module.exports = LinkUtils;