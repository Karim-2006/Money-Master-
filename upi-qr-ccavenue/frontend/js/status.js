document.addEventListener('DOMContentLoaded', () => {
    const checkStatusBtn = document.getElementById('checkStatusBtn');
    const paymentStatusResultDiv = document.getElementById('statusResult');

    checkStatusBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const orderId = document.getElementById('orderId').value;

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/payment-status/${orderId}`);
            const data = await response.json();

            if (response.ok) {
                paymentStatusResultDiv.innerHTML = `
                    <p>Order ID: ${data.orderId}</p>
                    <p>Transaction ID: ${data.transactionId}</p>
                    <p>Amount: ${data.amount}</p>
                    <p>Status: ${data.status}</p>
                    <p>Last Updated: ${new Date(data.updatedAt).toLocaleString()}</p>
                `;
            } else {
                paymentStatusResultDiv.innerHTML = `<p>Error: ${data.message}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            paymentStatusResultDiv.innerHTML = `<p>An error occurred. Please try again.</p>`;
        }
    });
});