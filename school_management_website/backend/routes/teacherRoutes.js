const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const teacherController = require('../controllers/teacherController');

// Get current logged-in teacher's staff profile
router.get("/students", authenticateToken, authorizeRoles("teacher"), teacherController.getStudents);

router.get('/me', authenticateToken, authorizeRoles('teacher'), teacherController.getMyProfile);

// Create teacher staff profile (onboarding)
router.post('/', authenticateToken, authorizeRoles('teacher'), teacherController.createProfile);
router.post("/student", authenticateToken, authorizeRoles("teacher"), teacherController.addStudent);


// Update teacher staff profile

router.put('/:staff_id', authenticateToken, authorizeRoles('teacher'), teacherController.updateProfile);
router.put("/student/:student_id", authenticateToken, authorizeRoles("teacher"), teacherController.updateStudent);


module.exports = router;
