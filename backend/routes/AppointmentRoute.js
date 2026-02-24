import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import {
  getAppointments,
  createAppointment,
  cancelAppointment,
  confirmPayment,
  getStats,
  getAppointmentByPatient,
  getRegisteredPatientsCount,
  getAppointmentByDoctor,
  updateAppointment
} from '../controllers/appoinmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/confirm", confirmPayment);
appointmentRouter.get("/stats", getStats);

// authenticated routes
appointmentRouter.post("/", clerkMiddleware(), createAppointment);
appointmentRouter.get("/me", clerkMiddleware(), getAppointmentByPatient);

appointmentRouter.get("/doctor/:doctorId", getAppointmentByDoctor);
appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get("/patient/count", getRegisteredPatientsCount);
appointmentRouter.put('/:id', updateAppointment);

export default appointmentRouter;