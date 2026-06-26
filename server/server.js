const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

let loadError = null;

const load = (path) => {
  try { return require(path); }
  catch (e) { loadError = e; return null; }
};

const authRoutes = load('./routes/authRoutes');
const userRoutes = load('./routes/userRoutes');
const projectRoutes = load('./routes/projectRoutes');
const teamRoutes = load('./routes/teamRoutes');
const taskRoutes = load('./routes/taskRoutes');
const documentRoutes = load('./routes/documentRoutes');
const meetingRoutes = load('./routes/meetingRoutes');
const groupRoutes = load('./routes/groupRoutes');
const resourceRoutes = load('./routes/resourceRoutes');
const challengeRoutes = load('./routes/challengeRoutes');
const notificationRoutes = load('./routes/notificationRoutes');
const messageRoutes = load('./routes/messageRoutes');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (loadError) {
    return res.status(500).json({ message: 'Module load error', error: loadError.message, stack: loadError.stack });
  }
  next();
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

app.get('/', (req, res) => {
  if (loadError) {
    return res.status(500).json({ message: 'Module load error', error: loadError.message });
  }
  res.json({ status: 'NAJAH API is running', version: '1.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app;
