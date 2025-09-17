document.addEventListener('DOMContentLoaded', () => {
    const qrForm = document.getElementById('qrForm');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const paymentStatusDiv = document.getElementById('paymentStatus');

    qrForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const amount = document.getElementById('amount').value;
        const payerEmail = document.getElementById('email').value;

        try {
            const response = await fetch('http://127.0.0.1:5000/api/generate-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, payerEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                qrCodeContainer.innerHTML = `<img src="${data.qrCodeImage}" alt="QR Code">`;
                paymentStatusDiv.innerHTML = `<p>Transaction ID: ${data.transactionId}</p><p>Status: Pending</p>`;
            } else {
                paymentStatusDiv.innerHTML = `<p>Error: ${data.message}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            paymentStatusDiv.innerHTML = `<p>An error occurred. Please try again.</p>`;
        }
    });
});