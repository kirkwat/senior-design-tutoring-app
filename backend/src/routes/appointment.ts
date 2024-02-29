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
  // .post("/", verifyRoles("tutor"), handleNewAppointment)
  // .put("/", verifyRoles("user"), handRegisterForAppointment)
  // .get("/", verifyRoles("user", "tutor"), handleFindAvailableAppointments)
  // .get("/available", verifyRoles("user", "tutor"), handleIsAvailable)
  // .get("/student", verifyRoles("user"), handleFindStudentsAppointments);

  .post("/", handleNewAppointment)
  .put("/", handRegisterForAppointment)
  .get("/", handleFindAvailableAppointments)
  .get("/available", handleIsAvailable)
  .get("/student", handleFindStudentsAppointments);

export default router;
