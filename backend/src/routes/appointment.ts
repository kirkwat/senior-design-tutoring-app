import express from "express";
import {
  handleCancelAppointment,
  handleGetAvailableTutorAppointments,
  handleGetStudentAppointments,
  handleGetTutorAppointments,
  handleNewAppointment,
  handleScheduleAppointment,
} from "../controllers/appointmentController";
import verifyRoles from "../middleware/verifyRole";

const router = express.Router();

router
  .post("/:tutorID", verifyRoles("tutor"), handleNewAppointment)
  .get("/tutor/:tutorID", verifyRoles("tutor"), handleGetTutorAppointments)
  .get("/student/:studentID", verifyRoles("user"), handleGetStudentAppointments)
  .get("/available/:tutorID",verifyRoles("user"),handleGetAvailableTutorAppointments)
  .put("/cancel/:appointmentID",verifyRoles("user", "tutor"),handleCancelAppointment)
  .put("/schedule/:appointmentID",verifyRoles("user"),handleScheduleAppointment);
;

export default router;
