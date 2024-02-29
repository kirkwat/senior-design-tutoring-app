import express from "express";
import {
  handleFindAvailableTutorsByDay,
  handleFindAvailableTutorsByTime,
  handleFindAvailableTutorsByWeek,
} from "../controllers/tutorController";

const router = express.Router();

router.get("/", handleFindAvailableTutorsByTime);
router.get("/day", handleFindAvailableTutorsByDay);
router.get("/week", handleFindAvailableTutorsByWeek);

export default router;
