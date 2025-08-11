import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { config } from './config/';
import route from './routes/';
import mongoose from 'mongoose';

const app = express();

// Midllewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    "http://localhost:8080", // dev - frontend
    "http://http://127.0.0.1:6274/", // dev - mcp inspector
    "https://stag-secure-widely.ngrok-free.app", // dev - ngrok 
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true) 
        else callback(new Error('Not allowed by CORS'), false) 
    }, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
})); 

// Routes 
route(app); 

// Connect to database
// mongoose.connect(process.env.MONGODB_URI || config.dbUrl) 
//     .then(() => console.log('Connected to database')) 
//     .catch(error => console.log(error));

// Start server
app.listen(process.env.PORT || config.port, () => {
    console.log(`Server is running on port ${process.env.PORT || config.port}`);
})
