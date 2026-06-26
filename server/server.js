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

const path = require('path');
const routesDir = __dirname;

app.use('/api/auth', lazyRouter(path.join(routesDir, 'routes/authRoutes')));
app.use('/api/users', lazyRouter(path.join(routesDir, 'routes/userRoutes')));
app.use('/api/projects', lazyRouter(path.join(routesDir, 'routes/projectRoutes')));
app.use('/api/teams', lazyRouter(path.join(routesDir, 'routes/teamRoutes')));
app.use('/api/tasks', lazyRouter(path.join(routesDir, 'routes/taskRoutes')));
app.use('/api/documents', lazyRouter(path.join(routesDir, 'routes/documentRoutes')));
app.use('/api/meetings', lazyRouter(path.join(routesDir, 'routes/meetingRoutes')));
app.use('/api/groups', lazyRouter(path.join(routesDir, 'routes/groupRoutes')));
app.use('/api/resources', lazyRouter(path.join(routesDir, 'routes/resourceRoutes')));
app.use('/api/challenges', lazyRouter(path.join(routesDir, 'routes/challengeRoutes')));
app.use('/api/notifications', lazyRouter(path.join(routesDir, 'routes/notificationRoutes')));
app.use('/api/messages', lazyRouter(path.join(routesDir, 'routes/messageRoutes')));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app;
