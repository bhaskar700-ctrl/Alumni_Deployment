import Admin from '../models/Admin.js';
import Alumni from '../models/Alumni.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';

// Get distinct departments from all user types
// Get distinct departments based on user type
export const getDistinctDepartments = async (req, res) => {
  const userType = req.params.userType;
  try {
    let departments = [];
    switch (userType) {
      case 'admins':
        departments = await Admin.distinct('department');
        break;
      case 'faculty':
        departments = await Faculty.distinct('department');
        break;
      default:
        departments = [];
    }
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get distinct years based on user type
export const getDistinctYears = async (req, res) => {
  const userType = req.params.userType;
  try {
    let years = [];
    switch (userType) {
      case 'alumni':
        years = await Alumni.distinct('graduationYear');
        break;
      case 'students':
        years = await Student.distinct('enrollmentYear');
        break;
      default:
        years = [];
    }
    res.json(years);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin Controllers
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAdmin = async (req, res) => {
  const admin = new Admin(req.body);
  try {
    const newAdmin = await admin.save();
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Alumni Controllers
export const getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAlumni = async (req, res) => {
  const alumni = new Alumni(req.body);
  try {
    const newAlumni = await alumni.save();
    res.status(201).json(newAlumni);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
    res.json(alumni);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
    res.json({ message: 'Alumni deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Faculty Controllers
export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createFaculty = async (req, res) => {
  const faculty = new Faculty(req.body);
  try {
    const newFaculty = await faculty.save();
    res.status(201).json(newFaculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student Controllers
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createStudent = async (req, res) => {
  const student = new Student(req.body);
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status500.json({ message: err.message });
  }
};
