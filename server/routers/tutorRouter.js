import express from 'express';
import { 
    addTutor, 
    getTodaySchedule, 
    getFullSchedule,
    getTutorById,
    updateTutor,
    deleteTutor,
    getTutorsBySubject,
    getTutorsByGrade,
    deleteMultipleTutors
} from '../controllers/tutorController.js';

const tutorRouter = express.Router();

// POST /api/add - Add new tutor
tutorRouter.post('/add', addTutor);

// GET /api/get-today - Get today's schedule
tutorRouter.get('/get-today', getTodaySchedule);

// GET /api/get-full - Get full schedule
tutorRouter.get('/get-full', getFullSchedule);

// GET /api/tutor/:id - Get single tutor by ID
tutorRouter.get('/tutor/:id', getTutorById);

// PUT /api/tutor/:id - Update tutor by ID
tutorRouter.put('/tutor/:id', updateTutor);

// DELETE /api/tutor/:id - Delete tutor by ID
tutorRouter.delete('/tutor/:id', deleteTutor);

// GET /api/subject/:subject - Get tutors by subject
tutorRouter.get('/subject/:subject', getTutorsBySubject);

// GET /api/grade/:grade - Get tutors by grade
tutorRouter.get('/grade/:grade', getTutorsByGrade);

// POST /api/delete-multiple - Delete multiple tutors
tutorRouter.post('/delete-multiple', deleteMultipleTutors);

export default tutorRouter;