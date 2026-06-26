const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.get('/', (req, res) => res.json({ status: 'ok' }));

try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
} catch (e) {
  app.get('/api/auth/login', (req, res) => res.status(500).json({ error: e.message }));
}

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;
