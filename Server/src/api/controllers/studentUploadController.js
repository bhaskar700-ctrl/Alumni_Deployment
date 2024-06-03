import csvParser from 'csv-parser';
import fs from 'fs';
import Student from '../models/Student.js';

const uploadStudents = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;
    const bulkOps = [];  // Array to hold bulk operations

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            // Prepare the upsert operation for each row in the CSV
            bulkOps.push({
                updateOne: {
                    filter: { studentId: row.studentId },
                    update: {
                        $set: {
                            name: row.name,
                            email: row.email,
                            department: row.department,
                            enrollmentYear: parseInt(row.enrollmentYear, 10),
                            graduationYear: row.graduationYear ? parseInt(row.graduationYear, 10) : undefined,
                            phoneNumber: row.phoneNumber,
                            address: row.address,
                            dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : undefined,
                            nationality: row.nationality,
                            gender: row.gender,
                            program: row.program,
                            status: row.status,
                            courses: row.courses ? JSON.parse(row.courses) : [],  // Assuming 'courses' is a JSON string
                            gpa: parseFloat(row.gpa)
                        }
                    },
                    upsert: true  // Insert the document if it does not exist, otherwise update it
                }
            });
        })
        .on('end', () => {
            if (bulkOps.length) {
                Student.bulkWrite(bulkOps)
                    .then((bulkWriteOpResult) => {
                        fs.unlinkSync(filePath);  // Delete the file after processing
                        res.status(201).send({ message: 'Students uploaded and saved successfully', bulkWriteOpResult });
                    })
                    .catch((error) => {
                        console.error('Error saving students to database:', error);
                        res.status(500).send('Error saving students to database');
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

export default {
    uploadStudents
};