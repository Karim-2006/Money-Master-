const crypto = require('crypto');

const encrypt = (plainText, workingKey) => {
    const m = crypto.createHash('md5').update(workingKey).digest();
    const key = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'); // Example key, replace with actual
    const iv = Buffer.from('0102030405060708090a0b0c0d0e0f10', 'hex'); // Example IV, replace with actual

    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decrypt = (encryptedText, workingKey) => {
    const m = crypto.createHash('md5').update(workingKey).digest();
    const key = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'); // Example key, replace with actual
    const iv = Buffer.from('0102030405060708090a0b0c0d0e0f10', 'hex'); // Example IV, replace with actual

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = {
    encrypt,
    decrypt
};