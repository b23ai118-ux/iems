const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
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
} = require('../controllers/adminController');

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);

// Students CRUD
router.route('/students').get(getStudents).post(createStudent);
router.route('/students/:id').put(updateStudent).delete(deleteStudent);

// Faculty CRUD
router.route('/faculty').get(getFaculty).post(createFaculty);
router.route('/faculty/:id').put(updateFaculty).delete(deleteFaculty);

// Internships
router.get('/internships', getInternships);
router.put('/internships/:id/assign', assignFaculty);

module.exports = router;
