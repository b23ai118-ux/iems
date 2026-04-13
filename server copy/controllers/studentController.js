const Internship = require('../models/Internship');

// @desc    Get student dashboard stats
// @route   GET /api/student/dashboard
// @access  Student
const getDashboard = async (req, res) => {
  try {
    const internships = await Internship.find({ studentId: req.user._id });
    const totalCompleted = internships.filter((i) => i.status === 'Accepted').length;
    const totalPending = internships.filter((i) => i.status === 'Pending').length;
    const totalRejected = internships.filter((i) => i.status === 'Rejected').length;
    
    let totalDurationDays = 0;
    internships.forEach((i) => {
      if (i.startDate && i.endDate) {
        totalDurationDays += Math.ceil(
          (new Date(i.endDate) - new Date(i.startDate)) / (1000 * 60 * 60 * 24)
        );
      }
    });

    res.json({
      totalInternships: internships.length,
      totalCompleted,
      totalPending,
      totalRejected,
      totalDurationDays,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit new internship
// @route   POST /api/student/internships
// @access  Student
const submitInternship = async (req, res) => {
  try {
    const { companyName, paid, startDate, endDate } = req.body;

    if (!companyName || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const internshipData = {
      studentId: req.user._id,
      companyName,
      paid: paid === 'true' || paid === true,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.certificate && req.files.certificate[0]) {
        internshipData.certificate = `/uploads/${req.files.certificate[0].filename}`;
      }
      if (req.files.lor && req.files.lor[0]) {
        internshipData.lor = `/uploads/${req.files.lor[0].filename}`;
      }
    }

    const internship = await Internship.create(internshipData);
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's internships
// @route   GET /api/student/internships
// @access  Student
const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ studentId: req.user._id })
      .populate('facultyId', 'name email')
      .sort('-createdAt');
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  submitInternship,
  getInternships,
};
