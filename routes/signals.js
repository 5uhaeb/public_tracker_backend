const router = require('express').Router();
const Signal = require('../models/Signal');

// Submit GPS signal
router.post('/send-signal', async (req, res) => {
  try {
    const signal = new Signal({
      user: req.userId,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    });
    await signal.save();
    res.status(201).send(signal);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get aggregated signals
router.get('/', async (req, res) => {
  try {
    const signals = await Signal.aggregate([
      { $group: { 
        _id: { lat: "$latitude", lng: "$longitude" }, 
        count: { $sum: 1 } 
      }}
    ]);
    res.send(signals);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;