import express from "express";
import { handleNewAppointment } from "../controllers/appointmentController";

const router = express.Router();

router.post("/", handleNewAppointment);

export default router;
