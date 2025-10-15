// controllers/adminController.js
import User from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';
import StudentLink from '../models/studentLink.js';
import Student from '../models/studentModel.js';

export const createCollege = async (req, res) => {
  try {
    const { collegeName, email } = req.body;

    // Generate random password
    const password = uuidv4().slice(0, 8);

    // Check if college already exists
    const existingCollege = await User.findOne({ email });
    if (existingCollege) {
      return res.status(400).json({ message: 'College with this email already exists' });
    }

    const college = new User({
      email,
      password,
      role: 'college',
      collegeName,
      createdBy: req.user.id
    });

    await college.save();

    res.status(201).json({
      message: 'College created successfully',
      college: {
        _id: college._id,
        email: college.email,
        collegeName: college.collegeName,
        generatedPassword: password
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllColleges = async (req, res) => {
  try {
    const colleges = await User.find({
      role: 'college',
      createdBy: req.user.id
    }).select('-password');

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteCollege = async (req,res) => {

  try {
    const { collegeId } = req.params

    const college = await User.findOne({
      _id: collegeId,
      role: 'college',
      createdBy: req.user.id
    })

    if (!college) {
      return res.status(404).json({ message: 'College not found or unauthorized' });
    }

    // Delete all related data
    await Student.deleteMany({ collegeId: collegeId });
    await StudentLink.deleteMany({ collegeId: collegeId });
    await User.deleteOne({ _id: collegeId });

    res.json({
      message: 'College and all related data deleted successfully',
      deletedCollege: college.collegeName
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
