const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

let authRoutes = null;
let loadError = null;
try {
  authRoutes = require('./routes/authRoutes');
} catch (e) {
  loadError = e.message;
}

app.get('/', (req, res) => res.json({ status: 'ok', authLoaded: authRoutes !== null, loadError }));

if (authRoutes) {
  app.use('/api/auth', authRoutes);
} else {
  app.use('/api/auth', (req, res) => res.status(500).json({ error: 'authRoutes not loaded', loadError }));
}

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;
