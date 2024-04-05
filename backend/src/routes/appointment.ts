import express from "express";
import {
  handleCancelAppointment,
  handleFindAvailableAppointments,
  handleFindStudentsAppointments,
  handleGetStudentAppointments,
  handleGetTutorAppointments,
  handleIsAvailable,
  handleNewAppointment,
} from "../controllers/appointmentController";
import { handRegisterForAppointment } from "../controllers/appointmentController";
import verifyRoles from "../middleware/verifyRole";

const router = express.Router();

router
  .post("/:tutorID", verifyRoles("tutor"), handleNewAppointment)
  .put("/:appointmentID", verifyRoles("user"), handRegisterForAppointment)
  .put(
    "/cancel/:appointmentID",
    verifyRoles("user", "tutor"),
    handleCancelAppointment,
  )
  .get("/", verifyRoles("user", "tutor"), handleFindAvailableAppointments)
  .get("/tutor/:tutorID", verifyRoles("tutor"), handleGetTutorAppointments)
  .get("/student/:studentID", verifyRoles("user"), handleGetStudentAppointments)
  .get("/available", verifyRoles("user", "tutor"), handleIsAvailable);

export default router;
