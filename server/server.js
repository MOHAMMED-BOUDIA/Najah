const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', (req, res) => {
  res.json({ status: 'NAJAH API running', cors: 'enabled' });
});

app.get('/api/auth/login', (req, res) => {
  res.json({ token: 'mock', user: { id: '1', name: 'Admin', email: 'admin@najah.com', role: 'admin' } });
});

module.exports = app;
