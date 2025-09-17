# UPI QR CCAvenue Payment System

This project implements a full-stack UPI QR Payment System with real-time webhook integration using the CCAvenue Business UPI API. It includes a Node.js/Express backend, a MongoDB database, and a simple HTML/CSS/JS frontend for payment initiation, status tracking, and transaction history.

## Project Structure

```
upi-qr-ccavenue/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── routes/
│   │   ├── qrRoutes.js           # Route to generate UPI QR via CCAvenue API
│   │   └── webhookRoutes.js      # Route to handle CCAvenue webhook
│   ├── controllers/
│   │   ├── qrController.js       # Logic for QR generation via API
│   │   └── webhookController.js  # Logic for processing webhook payloads
│   ├── models/
│   │   └── Payment.js            # MongoDB Payment schema
│   ├── utils/
│   │   ├── qrcodeGenerator.js    # Generate fallback QR if API fails
│   │   └── verifyWebhook.js      # Verify webhook signature from CCAvenue
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   └── package.json
│
├── frontend/
│   ├── index.html                # Payment form & QR display
│   ├── payment-status.html       # Page to show payment result
│   ├── history.html              # Transaction history
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── qr.js                 # Fetch QR from backend & display
│       ├── status.js             # Poll payment status
│       └── history.js            # Display history
│
├── .env                          # Environment variables (CCAvenue creds, DB URI, secrets)
└── README.md
```

## Setup and Installation

### Prerequisites

*   Node.js (v14 or higher)
*   MongoDB (local or cloud instance)
*   CCAvenue Business Account with API credentials (Merchant ID, Access Code, Working Key)

### 1. Clone the repository

```bash
git clone <repository-url>
cd upi-qr-ccavenue
```

### 2. Environment Variables

Create a `.env` file in the root directory (`upi-qr-ccavenue/`) and populate it with your credentials:

```
MONGO_URI=mongodb://localhost:27017/upi_ccavenue
PORT=5000
CCA_MERCHANT_ID=yourMerchantId
CCA_ACCESS_CODE=yourAccessCode
CCA_WORKING_KEY=yourWorkingKey
CCA_BASE_URL=https://apitest.ccavenue.com/apis/upi
PAYMENT_EXPIRY_MINUTES=15
```

*   **`MONGO_URI`**: Your MongoDB connection string.
*   **`PORT`**: The port for the backend server to run on.
*   **`CCA_MERCHANT_ID`**: Your CCAvenue Merchant ID.
*   **`CCA_ACCESS_CODE`**: Your CCAvenue Access Code.
*   **`CCA_WORKING_KEY`**: Your CCAvenue Working Key.
*   **`CCA_BASE_URL`**: The base URL for CCAvenue UPI API. Use `https://apitest.ccavenue.com/apis/upi` for sandbox testing.
*   **`PAYMENT_EXPIRY_MINUTES`**: Time in minutes after which a pending payment will expire.

### 3. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will start on the specified `PORT` (default: 5000).

### 4. Frontend Setup

Open `frontend/index.html` in your web browser.

## Usage

1.  **Generate QR**: Enter the amount and payer email in the frontend form and click "Generate QR". The backend will call the CCAvenue API to generate a QR code.
2.  **Scan and Pay**: Use any UPI app to scan the displayed QR code and complete the payment.
3.  **Real-time Status**: The frontend will poll the backend for the transaction status, which will be updated via CCAvenue webhooks.
4.  **Transaction History**: View past transactions on the `history.html` page.

## API Endpoints

### Backend

*   `POST /generate-qr`: Generates a UPI QR code.
    *   Request Body: `{ amount: Number, payerEmail: String }`
    *   Response: `{ qrCodeUrl: String, transactionId: String }`
*   `POST /webhook/payment-status`: Handles CCAvenue webhook notifications.
*   `GET /transaction/:id`: Retrieves the status of a specific transaction.
*   `GET /history`: Lists the last 100 transactions.

## Webhook Verification

CCAvenue sends an `encResp` payload which is AES encrypted with your `WorkingKey`. The backend decrypts this payload and verifies the checksum to ensure data integrity.

## Sandbox Testing

Use the provided CCAvenue test credentials and set `CCA_BASE_URL` to `https://apitest.ccavenue.com/apis/upi` in your `.env` file for sandbox testing.

## Additional Features

*   **Transaction History Dashboard**: A simple page to view past transactions.
*   **Auto-expiry for Pending Payments**: Payments that remain pending for `PAYMENT_EXPIRY_MINUTES` will be marked as failed.