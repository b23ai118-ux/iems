const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getInternships,
  updateStatus,
  evaluateInternship,
} = require('../controllers/facultyController');

// All routes require faculty role
router.use(protect, authorize('faculty'));

router.get('/dashboard', getDashboard);
router.get('/internships', getInternships);
router.put('/internships/:id/status', updateStatus);
router.put('/internships/:id/evaluate', evaluateInternship);

module.exports = router;
