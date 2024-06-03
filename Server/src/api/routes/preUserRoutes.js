import express from 'express';
import {
  getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin,
  getAllAlumni, getAlumniById, createAlumni, updateAlumni, deleteAlumni,
  getAllFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty,
  getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent,
  getDistinctDepartments, getDistinctYears
} from '../controllers/preUserController.js';

const router = express.Router();

// Admin Routes
router.route('/admins')
  .get(getAllAdmins)
  .post(createAdmin);

router.route('/admins/:id')
  .get(getAdminById)
  .put(updateAdmin)
  .delete(deleteAdmin);

// Alumni Routes
router.route('/alumni')
  .get(getAllAlumni)
  .post(createAlumni);

router.route('/alumni/:id')
  .get(getAlumniById)
  .put(updateAlumni)
  .delete(deleteAlumni);

// Faculty Routes
router.route('/faculty')
  .get(getAllFaculty)
  .post(createFaculty);

router.route('/faculty/:id')
  .get(getFacultyById)
  .put(updateFaculty)
  .delete(deleteFaculty);

// Student Routes
router.route('/students')
  .get(getAllStudents)
  .post(createStudent);

router.route('/students/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

// Distinct Routes
router.route('/distinct-departments/:userType')
  .get(getDistinctDepartments);

router.route('/distinct-years/:userType')
  .get(getDistinctYears);

export default router;
