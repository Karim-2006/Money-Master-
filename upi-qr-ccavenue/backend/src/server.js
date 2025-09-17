require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const db = require('./config/db');
const qrRoutes = require('./routes/qrRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

// Connect to MongoDB
db();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Routes
app.use('/api', qrRoutes);
app.use('/webhook', webhookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;