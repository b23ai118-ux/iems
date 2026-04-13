const User = require('../models/User');
const Internship = require('../models/Internship');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalInternships = await Internship.countDocuments();
    const evaluatedInternships = await Internship.countDocuments({
      'evaluation.rating': { $ne: null },
    });
    const pendingInternships = await Internship.countDocuments({ status: 'Pending' });
    const acceptedInternships = await Internship.countDocuments({ status: 'Accepted' });
    const rejectedInternships = await Internship.countDocuments({ status: 'Rejected' });

    res.json({
      totalStudents,
      totalFaculty,
      totalInternships,
      evaluatedInternships,
      pendingInternships,
      acceptedInternships,
      rejectedInternships,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Admin
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort('-createdAt');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create student
// @route   POST /api/admin/students
// @access  Admin
const createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const student = await User.create({ name, email, password, role: 'student' });
    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/admin/students/:id
// @access  Admin
const updateStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, email, password } = req.body;
    if (name) student.name = name;
    if (email) student.email = email;
    if (password) student.password = password;

    await student.save();
    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Internship.deleteMany({ studentId: student._id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student and associated internships deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all faculty
// @route   GET /api/admin/faculty
// @access  Admin
const getFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('-password').sort('-createdAt');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create faculty
// @route   POST /api/admin/faculty
// @access  Admin
const createFaculty = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const faculty = await User.create({ name, email, password, role: 'faculty' });
    res.status(201).json({
      _id: faculty._id,
      name: faculty.name,
      email: faculty.email,
      role: faculty.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update faculty
// @route   PUT /api/admin/faculty/:id
// @access  Admin
const updateFaculty = async (req, res) => {
  try {
    const faculty = await User.findById(req.params.id);
    if (!faculty || faculty.role !== 'faculty') {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const { name, email, password } = req.body;
    if (name) faculty.name = name;
    if (email) faculty.email = email;
    if (password) faculty.password = password;

    await faculty.save();
    res.json({
      _id: faculty._id,
      name: faculty.name,
      email: faculty.email,
      role: faculty.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete faculty
// @route   DELETE /api/admin/faculty/:id
// @access  Admin
const deleteFaculty = async (req, res) => {
  try {
    const faculty = await User.findById(req.params.id);
    if (!faculty || faculty.role !== 'faculty') {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all internships
// @route   GET /api/admin/internships
// @access  Admin
const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('studentId', 'name email')
      .populate('facultyId', 'name email')
      .sort('-createdAt');
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign faculty to internship
// @route   PUT /api/admin/internships/:id/assign
// @access  Admin
const assignFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== 'faculty') {
      return res.status(400).json({ message: 'Invalid faculty ID' });
    }

    internship.facultyId = facultyId;
    await internship.save();

    const updated = await Internship.findById(internship._id)
      .populate('studentId', 'name email')
      .populate('facultyId', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getInternships,
  assignFaculty,
};
