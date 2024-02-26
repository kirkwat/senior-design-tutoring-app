import express from "express";
import { handleFindAvailableAppointments, handleFindStudentsAppointments} from "../controllers/appointmentController";

const router = express.Router();

router.get("/", handleFindAvailableAppointments);
router.get("/student", handleFindStudentsAppointments)

export default router;