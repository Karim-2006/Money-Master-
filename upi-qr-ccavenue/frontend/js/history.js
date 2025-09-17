document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('historyList');

    const fetchPaymentHistory = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/history');
            const data = await response.json();

            if (response.ok) {
                historyList.innerHTML = ''; // Clear previous entries
                if (data.length === 0) {
                    historyList.innerHTML = '<p>No payment history found.</p>';
                    return;
                }
                data.forEach(payment => {
                    const listItem = document.createElement('li');
                    listItem.className = 'payment-item';
                    listItem.innerHTML = `
                        <h3>Order ID: ${payment.orderId}</h3>
                        <p>Transaction ID: ${payment.transactionId}</p>
                        <p>Amount: ${payment.amount}</p>
                        <p>Status: ${payment.status}</p>
                        <p>Date: ${new Date(payment.createdAt).toLocaleString()}</p>
                    `;
                    historyList.appendChild(listItem);
                });
            } else {
                historyList.innerHTML = `<p>Error: ${data.message}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            historyList.innerHTML = `<p>An error occurred. Please try again.</p>`;
        }
    };

    fetchPaymentHistory();
});