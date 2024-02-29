import express from "express";
import {
  handleFindAvailableAppointments,
  handleFindStudentsAppointments,
  handleIsAvailable,
} from "../controllers/appointmentController";

const router = express.Router();

router.get("/", handleFindAvailableAppointments);
router.get("/available", handleIsAvailable);
router.get("/student", handleFindStudentsAppointments);

export default router;
