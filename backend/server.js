import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import commentRoutes from './routes/comment.routes.js';

dotenv.config(); 

const app = express()

connectDB(); 

app.use(express.json()); 

// Middleware to parse cookies
app.use(cookieParser()); 

// auth routes
app.use('/auth', authRoutes);
// ticket routes
app.use("/tickets", ticketRoutes);
// comment routes
app.use("/tickets", commentRoutes);

//start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})