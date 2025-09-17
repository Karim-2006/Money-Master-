const crypto = require('crypto');

const CCA_WORKING_KEY = process.env.CCA_WORKING_KEY;

// This function would typically verify the integrity of the webhook data
// CCAvenue's webhook verification usually involves decrypting the response
// and potentially checking a checksum if provided in the decrypted data.
// For this example, we'll assume decryption is the primary verification step.

exports.verifyWebhook = (encryptedResponse) => {
    try {
        // In a real scenario, you would decrypt the response here
        // and then validate its content, possibly against a stored transaction.
        // For now, we'll just return true if decryption is successful (or simulated successful).

        // Example: Decrypting the response (assuming a utility function exists)
        // const decrypted = decrypt(encryptedResponse, CCA_WORKING_KEY);
        // if (!decrypted) return false;

        // For demonstration, we'll just check if the encryptedResponse is not empty
        return encryptedResponse && encryptedResponse.length > 0;

    } catch (error) {
        console.error('Error verifying webhook:', error);
        return false;
    }
};