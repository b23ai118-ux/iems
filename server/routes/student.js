const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getDashboard,
  submitInternship,
  getInternships,
} = require('../controllers/studentController');

// All routes require student role
router.use(protect, authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/internships', getInternships);
router.post(
  '/internships',
  upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'lor', maxCount: 1 },
  ]),
  submitInternship
);

module.exports = router;
