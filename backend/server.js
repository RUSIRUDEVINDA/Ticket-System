import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config(); // Load environment variables from .env file

const app = express()

connectDB(); // Connect to the database

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the Ticket System backend!');
})


//start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})