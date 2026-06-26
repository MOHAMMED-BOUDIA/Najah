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

app.get('/api/seed-admin-najah-2024', async (req, res) => {
  try {
    const User = require('./models/user');
    const bcrypt = require('bcryptjs');
    await User.deleteOne({ email: 'admin@najah.com' });
    const hashedPassword = await bcrypt.hash('Admin@1234', 10);
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@najah.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      department: 'Administration'
    });
    res.json({ success: true, message: 'Admin created', credentials: { email: 'admin@najah.com', password: 'Admin@1234' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
