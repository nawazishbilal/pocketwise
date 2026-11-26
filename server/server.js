import express from "express"
import cors from "cors"
import { config } from "dotenv"
config();

import connectDB from "./config/db.js"

import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import lentRoutes from './routes/lentRoutes.js'

import protect from './middleware/authMiddleware.js'

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/lents', lentRoutes)

app.get('/', (req, res) => {
    res.json({
        message: 'pocketwise api is running!'
    })
})

app.get('/api/auth/me', protect, (req, res) => {
    res.json({
        message: 'Authenticated Successfully',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    })
})

const startServer = async () => {
    
    const PORT = process.env.PORT || 8000;

    try {
        await connectDB();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}

startServer();