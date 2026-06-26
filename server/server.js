const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;
