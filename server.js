const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON data matching your fetch request

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// 2. Define the Form Schema and Model
const contactSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// 3. Define the API Route (matches your HTML action: /api/contact)
app.post('/api/contact', async (req, res) => {
    try {
        const { full_name, email, subject, message } = req.body;

        // Create a new document instance
        const newInquiry = new Contact({
            full_name,
            email,
            subject,
            message
        });

        // Save into MongoDB
        await newInquiry.save();

        // Respond back to your front-end script
        res.status(201).json({ message: 'Inquiry saved successfully!' });
    } catch (error) {
        console.error('Error saving inquiry:', error);
        res.status(500).json({ error: 'Server error. Failed to save inquiry.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running smoothly on port ${PORT}`);
});