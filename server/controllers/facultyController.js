const Internship = require('../models/Internship');

// @desc    Get faculty dashboard stats
// @route   GET /api/faculty/dashboard
// @access  Faculty
const getDashboard = async (req, res) => {
  try {
    const totalAssigned = await Internship.countDocuments({ facultyId: req.user._id });
    const totalEvaluated = await Internship.countDocuments({
      facultyId: req.user._id,
      'evaluation.rating': { $ne: null },
    });
    const pendingReview = await Internship.countDocuments({
      facultyId: req.user._id,
      status: 'Pending',
    });
    const accepted = await Internship.countDocuments({
      facultyId: req.user._id,
      status: 'Accepted',
    });
    const rejected = await Internship.countDocuments({
      facultyId: req.user._id,
      status: 'Rejected',
    });

    res.json({
      totalAssigned,
      totalEvaluated,
      pendingReview,
      accepted,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get internships assigned to faculty
// @route   GET /api/faculty/internships
// @access  Faculty
const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ facultyId: req.user._id })
      .populate('studentId', 'name email')
      .sort('-createdAt');
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update internship status (accept/reject)
// @route   PUT /api/faculty/internships/:id/status
// @access  Faculty
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Accepted or Rejected' });
    }

    const internship = await Internship.findOne({
      _id: req.params.id,
      facultyId: req.user._id,
    });

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found or not assigned to you' });
    }

    internship.status = status;
    await internship.save();

    const updated = await Internship.findById(internship._id)
      .populate('studentId', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Evaluate internship
// @route   PUT /api/faculty/internships/:id/evaluate
// @access  Faculty
const evaluateInternship = async (req, res) => {
  try {
    const { rating, remarks } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const internship = await Internship.findOne({
      _id: req.params.id,
      facultyId: req.user._id,
    });

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found or not assigned to you' });
    }

    internship.evaluation = {
      rating: Number(rating),
      remarks: remarks || '',
    };
    internship.status = 'Accepted';
    await internship.save();

    const updated = await Internship.findById(internship._id)
      .populate('studentId', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getInternships,
  updateStatus,
  evaluateInternship,
};
