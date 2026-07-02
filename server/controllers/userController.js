const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, department, phone } = req.body;

    if (!email || !email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'instructor',
      department,
      phone,
      isVerified: true,
    });

    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).select('-password -avatar').lean(),
      User.countDocuments(),
    ]);
    res.json({ data: users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const updates = { ...req.body };

    // Instructors cannot change their own department
    if (req.user.role === 'instructor' && req.user._id.toString() === req.params.id) {
      delete updates.department;
    }

    // Students cannot change their own department
    if (req.user.role === 'student' && req.user._id.toString() === req.params.id) {
      delete updates.department;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: req.file.path },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInstructors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const filter = { role: 'instructor' };
    const [instructors, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).select('-password').lean(),
      User.countDocuments(filter),
    ]);
    res.json({ data: instructors, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyInstructor = async (req, res) => {
  try {
    const Group = require('../models/Group');
    const group = await Group.findOne({ members: req.user._id }).populate('instructor', 'name avatar department');
    if (!group || !group.instructor) {
      return res.status(404).json({ message: 'No instructor assigned yet' });
    }
    res.json(group.instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const filter = { role: 'student' };
    const [students, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).select('-password -avatar').lean(),
      User.countDocuments(filter),
    ]);
    res.json({ data: students, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};