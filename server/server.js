import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import tutorRouter from './routers/tutorRouter.js';

// Load environment variables
dotenv.config(); 

const app = express();

// Improved CORS configuration - allow all origins in development
app.use(cors({
    origin: true, // This reflects the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path} - Body:`, req.body);
    next();
});

// MongoDB Connection with better error handling
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            console.error('❌ MONGODB_URL is not defined in .env file');
            console.error('Please create a .env file with MONGODB_URL=your_connection_string');
            process.exit(1);
        }
        
        console.log('📡 Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGODB_URL.replace(/:([^:@]+)@/, ':****@')); // Hide password
        
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✅ MongoDB Connected Successfully');
        
        // Test the connection by counting documents
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 Available collections:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('🚀 Server is working - Tutor API');
});

// Test endpoint to check database
app.get('/api/test-db', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({ 
            message: 'Database connected', 
            collections: collections.map(c => c.name),
            dbName: mongoose.connection.name 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use tutor routes
app.use('/api', tutorRouter);

// 404 handler
app.use((req, res) => {
    console.log('❌ 404 - Route not found:', req.method, req.path);
    res.status(404).json({ message: `Route ${req.path} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err);
    res.status(500).json({ 
        message: 'Internal server error', 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📍 Test database: http://localhost:${PORT}/api/test-db`);
});