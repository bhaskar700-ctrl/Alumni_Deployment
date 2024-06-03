import csvParser from 'csv-parser';
import fs from 'fs';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Admin from '../models/Admin.js';
import Alumni from '../models/Alumni.js';

const processCsv = (filePath, Model, res) => {
    const bulkOps = [];  // Array to hold bulk operations

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            // Parse JSON fields
            if (row.coursesCompleted) {
                try {
                    row.coursesCompleted = JSON.parse(row.coursesCompleted);
                } catch (e) {
                    console.error('Error parsing coursesCompleted:', e);
                    row.coursesCompleted = [];  // or handle the error as appropriate
                }
            }
            if (row.courses) {
                try {
                    row.courses = JSON.parse(row.courses);
                } catch (e) {
                    console.error('Error parsing courses:', e);
                    row.courses = [];  // or handle the error as appropriate
                }
            }

            bulkOps.push({
                updateOne: {
                    filter: { email: row.email },
                    update: { $set: row },
                    upsert: true
                }
            });
        })
        .on('end', () => {
            if (bulkOps.length) {
                Model.bulkWrite(bulkOps)
                    .then((bulkWriteOpResult) => {
                        fs.unlinkSync(filePath);  // Delete the file after processing
                        res.status(201).send({ message: 'Data uploaded and saved successfully', bulkWriteOpResult });
                    })
                    .catch((error) => {
                        console.error('Error saving data to database:', error);
                        res.status(500).send('Error saving data to database');
                    });
            } else {
                fs.unlinkSync(filePath);  // Delete the file if no operations are to be performed
                res.status(400).send('No valid data found to import');
            }
        })
        .on('error', (error) => {
            console.error('Error processing file:', error);
            res.status(500).send('Error processing file');
        });
};

const uploadStudents = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    processCsv(req.file.path, Student, res);
};

const uploadFaculty = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    processCsv(req.file.path, Faculty, res);
};

const uploadAdmins = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    processCsv(req.file.path, Admin, res);
};

const uploadAlumni = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    processCsv(req.file.path, Alumni, res);
};

export default {
    uploadStudents,
    uploadFaculty,
    uploadAdmins,
    uploadAlumni
};
