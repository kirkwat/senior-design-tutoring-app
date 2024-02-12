import express from "express";
import { handleFindAvailableAppointments} from "../controllers/appointmentController";

const router = express.Router();

router.get("/", handleFindAvailableAppointments);

export default router;