import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';

dotenv.config(); // Load environment variables from .env file

const app = express()

connectDB(); // Connect to the database

app.use(express.json()); // Middleware to parse JSON request bodies

app.use(cookieParser()); // Middleware to parse cookies

// auth routes
app.use('/auth', authRoutes);
// ticket routes
app.use("/tickets", ticketRoutes);

//start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})