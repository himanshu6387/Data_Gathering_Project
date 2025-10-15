// controllers/collegeController.js
import StudentLink from '../models/studentLink.js';
import Student from '../models/studentModel.js';
import XLSX from 'xlsx'
import archiver from 'archiver';
import {v4 as uuidv4} from 'uuid'
import https from 'http'
import fs from 'fs'
import path from 'path'

export const generateStudentLink = async (req, res) => {
  try {
    const linkId = uuidv4();
    
    const studentLink = new StudentLink({
      linkId,
      collegeId: req.user.id,
      collegeName: req.user.collegeName
    });

    await studentLink.save();

    const fullLink = `${process.env.FRONTEND_URL}/student-form/${linkId}`;
    
    res.json({
      message: 'Student data collection link generated',
      link: fullLink,
      linkId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ collegeId: req.user.id });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadExcel = async (req, res) => {
  try {
    const students = await Student.find({ collegeId: req.user.id });
    
    const worksheet = XLSX.utils.json_to_sheet(students.map(student => ({
      'Name': student.name,
      'Class': student.class,
      'Section': student.section,
      'Aadhar': student.aadhar,
      'Phone': student.phone,
      'Father Name': student.fatherName,
      'Mother Name': student.motherName,
      'Date of Birth': student.dob.toDateString(),
      'Address': student.address,
      'Admission No': student.admissionNo,
      'Email': student.email,
      'Created At': student.createdAt.toDateString()
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', `attachment; filename="${req.user.collegeName}_students.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadImages = async (req, res) => {
  try {
    const students = await Student.find({ collegeId: req.user.id });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${req.user.collegeName}_student_images.zip"`);
    
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    archive.pipe(res);
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      if (student.studentImage) {
        try {
          const imageUrl = student.studentImage;
          const imageName = `${student.name}_${student.admissionNo}.jpg`;
          
          // Add image from URL to zip
          const response = await fetch(imageUrl);
          if (response.ok) {
            const buffer = await response.arrayBuffer();
            archive.append(Buffer.from(buffer), { name: imageName });
          }
        } catch (err) {
          console.error(`Error downloading image for ${student.name}:`, err);
        }
      }
    }
    
    archive.finalize();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

