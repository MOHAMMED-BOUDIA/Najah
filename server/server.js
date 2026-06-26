const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { return res.status(500).json({ message: 'DB connection failed', error: err.message }); }
});

app.get('/', (req, res) => res.json({ status: 'NAJAH API running', version: '1.0' }));

let authRoutes, userRoutes, projectRoutes, teamRoutes, taskRoutes;
let documentRoutes, meetingRoutes, groupRoutes, resourceRoutes;
let challengeRoutes, notificationRoutes, messageRoutes;

const status = {};
try { authRoutes = require('./routes/authRoutes'); status.authRoutes = 'ok'; } catch (e) { status.authRoutes = e.message; }
try { userRoutes = require('./routes/userRoutes'); status.userRoutes = 'ok'; } catch (e) { status.userRoutes = e.message; }
try { projectRoutes = require('./routes/projectRoutes'); status.projectRoutes = 'ok'; } catch (e) { status.projectRoutes = e.message; }
try { teamRoutes = require('./routes/teamRoutes'); status.teamRoutes = 'ok'; } catch (e) { status.teamRoutes = e.message; }
try { taskRoutes = require('./routes/taskRoutes'); status.taskRoutes = 'ok'; } catch (e) { status.taskRoutes = e.message; }
try { documentRoutes = require('./routes/documentRoutes'); status.documentRoutes = 'ok'; } catch (e) { status.documentRoutes = e.message; }
try { meetingRoutes = require('./routes/meetingRoutes'); status.meetingRoutes = 'ok'; } catch (e) { status.meetingRoutes = e.message; }
try { groupRoutes = require('./routes/groupRoutes'); status.groupRoutes = 'ok'; } catch (e) { status.groupRoutes = e.message; }
try { resourceRoutes = require('./routes/resourceRoutes'); status.resourceRoutes = 'ok'; } catch (e) { status.resourceRoutes = e.message; }
try { challengeRoutes = require('./routes/challengeRoutes'); status.challengeRoutes = 'ok'; } catch (e) { status.challengeRoutes = e.message; }
try { notificationRoutes = require('./routes/notificationRoutes'); status.notificationRoutes = 'ok'; } catch (e) { status.notificationRoutes = e.message; }
try { messageRoutes = require('./routes/messageRoutes'); status.messageRoutes = 'ok'; } catch (e) { status.messageRoutes = e.message; }

if (authRoutes) app.use('/api/auth', authRoutes);
if (userRoutes) app.use('/api/users', userRoutes);
if (projectRoutes) app.use('/api/projects', projectRoutes);
if (teamRoutes) app.use('/api/teams', teamRoutes);
if (taskRoutes) app.use('/api/tasks', taskRoutes);
if (documentRoutes) app.use('/api/documents', documentRoutes);
if (meetingRoutes) app.use('/api/meetings', meetingRoutes);
if (groupRoutes) app.use('/api/groups', groupRoutes);
if (resourceRoutes) app.use('/api/resources', resourceRoutes);
if (challengeRoutes) app.use('/api/challenges', challengeRoutes);
if (notificationRoutes) app.use('/api/notifications', notificationRoutes);
if (messageRoutes) app.use('/api/messages', messageRoutes);

app.get('/__debug', (req, res) => res.json(status));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app;
