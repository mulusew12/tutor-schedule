import express from 'express';
import { addTutor, getTodaySchedule, getFullSchedule } from '../controllers/tutorController.js';
const tutorRouter = express.Router();

// POST /api/add - Add new tutor
tutorRouter.post('/add', addTutor);

// GET /api/get-today - Get today's schedule
tutorRouter.get('/get-today', getTodaySchedule);
// GET /api/get-full - Get full schedule
tutorRouter.get('/get-full', getFullSchedule);
export default tutorRouter;
