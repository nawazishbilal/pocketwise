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

app.use(cors())
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
    await connectDB();
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
        console.log(`Server is Running on: ${PORT}`);
    })
}

startServer();