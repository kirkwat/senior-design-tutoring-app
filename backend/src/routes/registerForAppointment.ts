import express from "express";
import { handRegisterForAppointment } from "../controllers/appointmentController";

const router = express.Router();

router.put("/", handRegisterForAppointment);

export default router;
