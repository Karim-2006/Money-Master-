const Payment = require('../models/Payment');
const { decrypt } = require('../utils/ccavenueUtils'); // Assuming you'll create this utility
const crypto = require('crypto');

const CCA_WORKING_KEY = process.env.CCA_WORKING_KEY;

exports.handleWebhook = async (req, res) => {
    const encResp = req.body.encResp;

    if (!encResp) {
        return res.status(400).send('No encrypted response found.');
    }

    try {
        // Decrypt the response
        const decryptedResponse = decrypt(encResp, CCA_WORKING_KEY);
        const params = new URLSearchParams(decryptedResponse);
        const orderStatus = Object.fromEntries(params.entries());

        const { order_id, order_status, mere_id, amount, trans_date } = orderStatus;

        // Verify checksum (if CCAvenue provides one in the decrypted response)
        // This part might need adjustment based on actual CCAvenue webhook documentation
        // For now, we'll proceed without explicit checksum verification if not provided by CCAvenue in the decrypted payload

        const payment = await Payment.findOne({ merchantOrderId: order_id });

        if (!payment) {
            console.error(`Payment with order_id ${order_id} not found.`);
            return res.status(404).send('Payment not found.');
        }

        let status = 'failed';
        if (order_status === 'Success') {
            status = 'successful';
        } else if (order_status === 'Aborted' || order_status === 'Failed') {
            status = 'failed';
        } else {
            status = 'pending'; // Or other appropriate status
        }

        payment.status = status;
        payment.updatedAt = new Date();
        await payment.save();

        res.status(200).send('Webhook received and processed.');

    } catch (error) {
        console.error('Error processing webhook:', error.message);
        res.status(500).send('Error processing webhook.');
    }
};