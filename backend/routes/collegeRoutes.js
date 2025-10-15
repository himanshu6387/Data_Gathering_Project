import { downloadExcel, downloadImages, generateStudentLink, getStudents } from '../controllers/collegeController.js';
import  express  from 'express';
import  {protect, collegeOnly }  from '../middlewares/auth.js';

const router = express.Router();

router.post('/generate-link', protect, collegeOnly, generateStudentLink);
router.get('/students', protect, collegeOnly, getStudents);
router.get('/download-excel', protect, collegeOnly, downloadExcel);
router.get('/download-images', protect, collegeOnly, downloadImages);

export default router;