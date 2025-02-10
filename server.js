const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const requestIp = require('request-ip');  // To get user IP addresses
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestIp.mw());  // Middleware to capture IP addresses

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Location Schema
const LocationSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', LocationSchema);

// POST Route to Submit Location
app.post('/api/submit-location', async (req, res) => {
    const ip = req.clientIp;  // Get user's IP address
    const { latitude, longitude } = req.body;

    try {
        // Check if the IP has already submitted a location
        const existingSubmission = await Location.findOne({ ip });
        if (existingSubmission) {
            return res.status(400).json({ message: 'Location already submitted from this IP.' });
        }

        // Save the new location
        const newLocation = new Location({ ip, latitude, longitude });
        await newLocation.save();

        res.status(201).json({ message: 'Location submitted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Route to Fetch All Locations for the Map
app.get('/api/locations', async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
