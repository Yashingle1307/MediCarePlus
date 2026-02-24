import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from './config/db.js';
import doctorRouter from './routes/doctorRoutes.js';
import serviceRouter from './routes/serviceRouter.js';
import appointmentRouter from './routes/AppointmentRoute.js';
import serviceAppointmentRouter from './routes/serviceAppointmentRouter.js';

const app=express();
const port=4000;

const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174']
    
// middleware
app.use(cors({

    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders:['Content-Type','Authorization']
}));

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// DB
connectDB();

// routes
app.use('/api/doctors',doctorRouter);
app.use('/api/services',serviceRouter); 
app.use('/api/appointments',appointmentRouter);
app.use('/api/service-appointments',serviceAppointmentRouter);

app.get('/',(req,res)=>{
    console.log("API is working");
    res.send("API is working");
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
})