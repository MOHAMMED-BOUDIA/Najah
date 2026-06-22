const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  try {
    const doc = new Document({
      name: req.body.name,
      file: req.file.path,
      type: req.body.type,
      project: req.body.project,
      uploadedBy: req.user._id,
      comment: req.body.comment
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDocsByProject = async (req, res) => {
  try {
    const docs = await Document.find({ project: req.params.projectId })
      .populate('uploadedBy', 'name');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};