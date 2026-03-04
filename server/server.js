import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import tutorRouter from './routers/tutorRouter.js';

// Load environment variables
dotenv.config(); 

const app = express();



// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // PARSE JSON BODIES (THIS WAS MISSING!)
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = ['http://localhost:5000', 'https://frontend-gules-eight-30.vercel.app']; // FRONTEND URL
app.use(cors({origin: allowedOrigins, credentials: true})); // CORS with credentials
// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('🚀 Server is working - Tutor API');
});

// Use tutor routes (NOT StudentRouter)
app.use('/api', tutorRouter);

// Use PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});