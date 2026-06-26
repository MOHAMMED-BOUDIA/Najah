const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: 'admin@najah.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@1234', salt);

    await User.create({
      name: 'Super Admin',
      email: 'admin@najah.com',
      password: hashedPassword,
      role: 'admin',
      department: 'Administration',
      isVerified: true,
    });

    console.log('Admin created: admin@najah.com / Admin@1234');

    process.exit(0);
  } catch (error) {
    console.error('Seed admin error:', error);
    process.exit(1);
  }
};

seedAdmin();
