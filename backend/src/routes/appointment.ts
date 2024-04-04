import express from "express";
import {
  handleFindAvailableAppointments,
  handleFindStudentsAppointments,
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
  .get("/", verifyRoles("user", "tutor"), handleFindAvailableAppointments)
  .get("/tutor/:tutorID", verifyRoles("tutor"), handleGetTutorAppointments)
  .get("/available", verifyRoles("user", "tutor"), handleIsAvailable)
  .get(
    "/student/:studentID",
    verifyRoles("user"),
    handleFindStudentsAppointments,
  );

export default router;
