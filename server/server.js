const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'NAJAH API is running', version: '1.0' });
});

const lazyRouter = (modulePath) => {
  let router;
  return (req, res, next) => {
    if (!router) {
      router = require(modulePath);
    }
    return router(req, res, next);
  };
};

app.use('/api/auth', lazyRouter('./routes/authRoutes'));
app.use('/api/users', lazyRouter('./routes/userRoutes'));
app.use('/api/projects', lazyRouter('./routes/projectRoutes'));
app.use('/api/teams', lazyRouter('./routes/teamRoutes'));
app.use('/api/tasks', lazyRouter('./routes/taskRoutes'));
app.use('/api/documents', lazyRouter('./routes/documentRoutes'));
app.use('/api/meetings', lazyRouter('./routes/meetingRoutes'));
app.use('/api/groups', lazyRouter('./routes/groupRoutes'));
app.use('/api/resources', lazyRouter('./routes/resourceRoutes'));
app.use('/api/challenges', lazyRouter('./routes/challengeRoutes'));
app.use('/api/notifications', lazyRouter('./routes/notificationRoutes'));
app.use('/api/messages', lazyRouter('./routes/messageRoutes'));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app;
