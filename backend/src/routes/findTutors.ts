import express from "express";
import { handleFindAvailableTutorsByTime } from "../controllers/tutorController";

const router = express.Router();

router.get("/", handleFindAvailableTutorsByTime);

export default router;