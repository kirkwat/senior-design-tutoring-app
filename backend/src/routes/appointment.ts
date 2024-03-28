import express from "express";
import {
  handleFindAvailableAppointments,
  handleFindStudentsAppointments,
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
  .get("/available", verifyRoles("user", "tutor"), handleIsAvailable)
  .get("/student/:studentID", verifyRoles("user"), handleFindStudentsAppointments);

  // .post("/:tutorID", handleNewAppointment)
  // .put("/:appointmentID", handRegisterForAppointment)
  // .get("/", handleFindAvailableAppointments)
  // .get("/available", handleIsAvailable)
  // .get("/student/:studentID", handleFindStudentsAppointments);



export default router;
