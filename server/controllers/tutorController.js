import Tutor from '../models/Tutor.js';

// Add new tutor
export const addTutor = async (req, res) => {
    try {
        // Log received data for debugging
        console.log('📥 Received request body:', JSON.stringify(req.body, null, 2));
        
        // Extract data from request body
        const { name, subject, grade, day, hourFrom, hourTo } = req.body;
        
        // Detailed validation
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!subject) missingFields.push('subject');
        if (!grade) missingFields.push('grade');
        if (!day) missingFields.push('day');
        if (!hourFrom) missingFields.push('hourFrom');
        if (!hourTo) missingFields.push('hourTo');
        
        if (missingFields.length > 0) {
            console.log('❌ Missing fields:', missingFields);
            return res.status(400).json({ 
                message: 'Missing required fields', 
                missingFields 
            });
        }

        // Validate that subject is an array and not empty
        if (!Array.isArray(subject)) {
            console.log('❌ Subject is not an array:', subject);
            return res.status(400).json({ 
                message: 'Subject must be an array' 
            });
        }
        
        if (subject.length === 0) {
            console.log('❌ Subject array is empty');
            return res.status(400).json({ 
                message: 'At least one subject is required' 
            });
        }

        // Validate that grade is an array and not empty
        if (!Array.isArray(grade)) {
            console.log('❌ Grade is not an array:', grade);
            return res.status(400).json({ 
                message: 'Grade must be an array' 
            });
        }
        
        if (grade.length === 0) {
            console.log('❌ Grade array is empty');
            return res.status(400).json({ 
                message: 'At least one grade is required' 
            });
        }

        // Validate time format (basic validation)
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        if (!timeRegex.test(hourFrom)) {
            return res.status(400).json({ 
                message: 'Invalid start time format. Use format: 9:00 AM' 
            });
        }
        if (!timeRegex.test(hourTo)) {
            return res.status(400).json({ 
                message: 'Invalid end time format. Use format: 5:00 PM' 
            });
        }

        // Create new tutor document
        const newTutor = new Tutor({
            name: name.trim(),
            subject: subject.map(s => s.trim().toLowerCase()),
            grade: grade.map(g => g.trim().toLowerCase()),
            day: day.trim(),
            hourFrom: hourFrom.trim(),
            hourTo: hourTo.trim()
        });

        // Save to database
        const savedTutor = await newTutor.save();
        console.log('✅ Tutor saved successfully with ID:', savedTutor._id);

        // Send success response
        res.status(201).json({ 
            message: 'Tutor added successfully', 
            tutor: savedTutor 
        });

    } catch (error) {
        console.error('❌ Error adding tutor:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
                console.error(`- ${field}:`, error.errors[field].message);
            }
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: errors 
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Duplicate entry found' 
            });
        }
        
        // Send error response
        res.status(500).json({ 
            message: 'Failed to add tutor', 
            error: error.message 
        });
    }
};

// Get all tutors (full schedule)
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

// Get tutor by ID
export const getTutorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'Invalid tutor ID format' 
            });
        }
        
        const tutor = await Tutor.findById(id);
        
        if (!tutor) {
            return res.status(404).json({ 
                message: 'Tutor not found' 
            });
        }
        
        res.status(200).json({
            message: 'Tutor retrieved successfully',
            tutor: tutor
        });
    } catch (error) {
        console.error('Error fetching tutor:', error);
        res.status(500).json({ 
            message: 'Failed to fetch tutor', 
            error: error.message 
        });
    }
};

// Update tutor
export const updateTutor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subject, grade, day, hourFrom, hourTo } = req.body;
        
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'Invalid tutor ID format' 
            });
        }
        
        // Validate required fields
        if (!name || !subject || !grade || !day || !hourFrom || !hourTo) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Validate that subject is an array and not empty
        if (!Array.isArray(subject) || subject.length === 0) {
            return res.status(400).json({ 
                message: 'At least one subject is required' 
            });
        }

        // Validate that grade is an array and not empty
        if (!Array.isArray(grade) || grade.length === 0) {
            return res.status(400).json({ 
                message: 'At least one grade is required' 
            });
        }
        
        // Find and update tutor
        const updatedTutor = await Tutor.findByIdAndUpdate(
            id,
            { 
                name: name.trim(), 
                subject: subject.map(s => s.trim().toLowerCase()), 
                grade: grade.map(g => g.trim().toLowerCase()), 
                day: day.trim(), 
                hourFrom: hourFrom.trim(), 
                hourTo: hourTo.trim() 
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedTutor) {
            return res.status(404).json({ 
                message: 'Tutor not found' 
            });
        }
        
        res.status(200).json({
            message: 'Tutor updated successfully',
            tutor: updatedTutor
        });
    } catch (error) {
        console.error('Error updating tutor:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation failed', 
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            message: 'Failed to update tutor', 
            error: error.message 
        });
    }
};

// Delete tutor
export const deleteTutor = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'Invalid tutor ID format' 
            });
        }
        
        const deletedTutor = await Tutor.findByIdAndDelete(id);
        
        if (!deletedTutor) {
            return res.status(404).json({ 
                message: 'Tutor not found' 
            });
        }
        
        res.status(200).json({
            message: 'Tutor deleted successfully',
            tutor: deletedTutor
        });
    } catch (error) {
        console.error('Error deleting tutor:', error);
        res.status(500).json({ 
            message: 'Failed to delete tutor', 
            error: error.message 
        });
    }
};

// Get tutors by subject
export const getTutorsBySubject = async (req, res) => {
    try {
        const { subject } = req.params;
        
        const tutors = await Tutor.find({ subject: subject.toLowerCase() }).sort({ day: 1, hourFrom: 1 });
        
        res.status(200).json({
            message: `Tutors teaching ${subject}`,
            count: tutors.length,
            schedule: tutors
        });
    } catch (error) {
        console.error('Error fetching tutors by subject:', error);
        res.status(500).json({ 
            message: 'Failed to fetch tutors', 
            error: error.message 
        });
    }
};

// Get tutors by grade
export const getTutorsByGrade = async (req, res) => {
    try {
        const { grade } = req.params;
        
        const tutors = await Tutor.find({ grade: grade.toLowerCase() }).sort({ day: 1, hourFrom: 1 });
        
        res.status(200).json({
            message: `Tutors teaching ${grade}`,
            count: tutors.length,
            schedule: tutors
        });
    } catch (error) {
        console.error('Error fetching tutors by grade:', error);
        res.status(500).json({ 
            message: 'Failed to fetch tutors', 
            error: error.message 
        });
    }
};

// Delete multiple tutors
export const deleteMultipleTutors = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ 
                message: 'Please provide an array of tutor IDs to delete' 
            });
        }
        
        // Validate each ID format
        const invalidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));
        if (invalidIds.length > 0) {
            return res.status(400).json({ 
                message: 'Invalid ID format detected',
                invalidIds 
            });
        }
        
        const result = await Tutor.deleteMany({ _id: { $in: ids } });
        
        res.status(200).json({
            message: 'Tutors deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting tutors:', error);
        res.status(500).json({ 
            message: 'Failed to delete tutors', 
            error: error.message 
        });
    }
};