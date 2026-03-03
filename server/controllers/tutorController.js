import Tutor from '../models/Tutor.js';

// Add new tutor
export const addTutor = async (req, res) => {
    try {
        // Extract data from request body
        const { name, subject, day, hourFrom, hourTo } = req.body;
        
        // Validate required fields
        if (!name || !subject || !day || !hourFrom || !hourTo) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Create new tutor document
        const newTutor = new Tutor({
            name,
            subject,
            day,
            hourFrom,
            hourTo
        });

        // Save to database
        await newTutor.save();

        // Send success response
        res.status(201).json({ 
            message: 'Tutor added successfully', 
            tutor: newTutor 
        });

    } catch (error) {
        console.error('Error adding tutor:', error);
        
        // Send error response
        res.status(500).json({ 
            message: 'Failed to add tutor', 
            error: error.message 
        });
    }
};

// Get today's schedule
export const getTodaySchedule = async (req, res) => {
    try {
        const today = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayDay = days[today.getDay()];
        
        const tutors = await Tutor.find({ day: todayDay }).sort({ hourFrom: 1 });
        
        res.status(200).json({
            message: `Today's (${todayDay}) schedule`,
            count: tutors.length,
            schedule: tutors
        });
    } catch (error) {
        console.error('Error fetching today\'s schedule:', error);
        res.status(500).json({ 
            message: 'Failed to fetch schedule', 
            error: error.message 
        });
    }
};

// Get full schedule (all tutors)
export const getFullSchedule = async (req, res) => {
    try {
        const tutors = await Tutor.find().sort({ day: 1, hourFrom: 1 });
        
        res.status(200).json({
            message: 'Full schedule retrieved',
            count: tutors.length,
            schedule: tutors
        });
    } catch (error) {
        console.error('Error fetching full schedule:', error);
        res.status(500).json({ 
            message: 'Failed to fetch schedule', 
            error: error.message 
        });
    }
};

export default { addTutor, getTodaySchedule, getFullSchedule };