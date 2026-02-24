import express from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  DoctorLogin,
  toggleAvailability
} from "../controllers/doctorController.js";

import doctorAuth from "../middleware/doctorAuth.js";
import multer from "multer";

const upload = multer({ dest: "/tmp" });
const doctorRouter = express.Router();

doctorRouter.get("/", getDoctors);
doctorRouter.post("/login", DoctorLogin);
doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", upload.single("image"), createDoctor);

doctorRouter.put("/:id", doctorAuth, upload.single("image"), updateDoctor);
doctorRouter.post("/:id/toggle-availability", doctorAuth, toggleAvailability);
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;