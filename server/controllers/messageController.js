const Message = require('../models/Message');
const Group = require('../models/Group');
const { getIO } = require('../socket');

exports.getMessages = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    const isInstructor = group.instructor.toString() === req.user._id.toString();
    if (!isMember && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ group: req.params.groupId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { groupId, content } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    const isInstructor = group.instructor.toString() === req.user._id.toString();
    if (!isMember && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const message = await Message.create({
      group: groupId,
      sender: req.user._id,
      content: content.trim()
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name email avatar');

    res.status(201).json(populated);

    const io = getIO();
    io.to(groupId.toString()).emit('newMessage', populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });

    const group = await Group.findById(msg.group);
    const isOwner = msg.sender.toString() === req.user._id.toString();
    const isGroupInstructor = group && group.instructor.toString() === req.user._id.toString();
    if (!isOwner && !isGroupInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const groupId = msg.group;
    await Message.findByIdAndDelete(req.params.id);

    const io = getIO();
    io.to(groupId.toString()).emit('messageDeleted', { messageId: req.params.id, groupId });

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
