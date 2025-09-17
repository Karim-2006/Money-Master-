const axios = require('axios');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const qrcode = require('qrcode');

const CCA_MERCHANT_ID = process.env.CCA_MERCHANT_ID;
const CCA_ACCESS_CODE = process.env.CCA_ACCESS_CODE;
const CCA_WORKING_KEY = process.env.CCA_WORKING_KEY;
const CCA_BASE_URL = process.env.CCA_BASE_URL;
const PAYMENT_EXPIRY_MINUTES = process.env.PAYMENT_EXPIRY_MINUTES || 15;

// Function to encrypt data for CCAvenue
const encrypt = (plainText, workingKey) => {
    const m = crypto.createHash('md5');
    m.update(workingKey);
    const key = m.digest();
    const iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Function to decrypt data from CCAvenue
const decrypt = (encText, workingKey) => {
    const m = crypto.createHash('md5');
    m.update(workingKey);
    const key = m.digest();
    const iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

exports.generateQr = async (req, res) => {
    const { amount, payerEmail } = req.body;

    if (!amount || !payerEmail) {
        return res.status(400).json({ message: 'Amount and payer email are required.' });
    }

    try {
        const merchantOrderId = `ORD-${Date.now()}`;
        const redirectUrl = `http://localhost:${process.env.PORT}/webhook/payment-status`; // Your webhook URL

        const paymentData = {
            merchant_id: CCA_MERCHANT_ID,
            order_id: merchantOrderId,
            amount: amount,
            currency: 'INR',
            redirect_url: redirectUrl,
            cancel_url: redirectUrl,
            language: 'EN',
            billing_email: payerEmail,
            // Add other necessary parameters as per CCAvenue API documentation
        };

        const encRequest = encrypt(JSON.stringify(paymentData), CCA_WORKING_KEY);

        const response = await axios.post(CCA_BASE_URL, {
            encRequest: encRequest,
            access_code: CCA_ACCESS_CODE,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Assuming CCAvenue returns a direct QR code URL or data to generate it
        // This part might need adjustment based on actual CCAvenue API response structure
        const qrCodeUrl = response.data.qrCodeUrl || await qrcode.toDataURL(`upi://pay?pa=${CCA_MERCHANT_ID}&pn=Merchant&mc=1234&tid=${merchantOrderId}&am=${amount}&cu=INR`);

        const newPayment = new Payment({
            transactionId: merchantOrderId,
            amount,
            payerEmail,
            merchantOrderId,
            qrCodeUrl,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newPayment.save();

        res.status(200).json({ qrCodeUrl, transactionId: merchantOrderId });

    } catch (error) {
        console.error('Error generating QR:', error.response ? error.response.data : error.message);
        // Fallback QR generation if API fails
        const fallbackQrCodeUrl = await qrcode.toDataURL(`upi://pay?pa=${CCA_MERCHANT_ID}&pn=Merchant&mc=1234&tid=FALLBACK-${Date.now()}&am=${amount}&cu=INR`);
        res.status(500).json({ message: 'Failed to generate QR code via CCAvenue API, fallback QR generated.', qrCodeUrl: fallbackQrCodeUrl });
    }
};

exports.getTransactionStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findOne({ transactionId: id });

        if (!payment) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        res.status(200).json({ status: payment.status, amount: payment.amount, payerEmail: payment.payerEmail });

    } catch (error) {
        console.error('Error fetching transaction status:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const history = await Payment.find().sort({ createdAt: -1 }).limit(100);
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching transaction history:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};