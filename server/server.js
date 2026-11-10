import express from "express"
import cors from "cors"
import { config } from "dotenv"
config();

import connectDB from "./config/db.js"

const app = express();

app.use(cors())
app.use(express.json());

const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
        console.log(`Server is Running on: ${PORT}`);
    })
}

startServer();