const Department = require('../models/Department');
const User = require('../models/User');

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }).lean();
    const withCounts = await Promise.all(
      departments.map(async (dept) => {
        const instructorCount = await User.countDocuments({ department: dept._id, role: 'instructor' });
        return { ...dept, instructorCount };
      })
    );
    res.json(withCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Department name is required' });
    }
    const existing = await Department.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Department already exists' });
    }
    const department = await Department.create({ name: name.trim(), createdBy: req.user.id });
    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Department already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Department name is required' });
    }
    const existing = await Department.findOne({ name: name.trim(), _id: { $ne: req.params.id } }).collation({ locale: 'en', strength: 2 });
    if (existing) {
      return res.status(400).json({ message: 'Department name already taken' });
    }
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    const userCount = await User.countDocuments({ department: department._id });
    if (userCount > 0) {
      return res.status(400).json({ message: `Cannot delete: ${userCount} user(s) are assigned to this department` });
    }
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
