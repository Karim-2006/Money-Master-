const QRCode = require('qrcode');

exports.generateQRCode = async (data) => {
    try {
        const qrCodeImage = await QRCode.toDataURL(data);
        return qrCodeImage;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
};