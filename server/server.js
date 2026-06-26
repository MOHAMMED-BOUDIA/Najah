const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok' }));

let loadError = null;
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
} catch (e) {
  loadError = e;
}

app.all('/api/auth/login', (req, res) => {
  res.status(500).json({ message: 'authRoutes failed to load', error: loadError?.message, stack: loadError?.stack });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;
