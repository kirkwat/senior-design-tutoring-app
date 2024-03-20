import express from "express";
import {
  handleFindAllTutors,
  handleFindAvailableTutorsByDay,
  handleFindAvailableTutorsByTime,
  handleFindAvailableTutorsByWeek,
  handleFindTutorByID,
} from "../controllers/tutorController";
import verifyRoles from "../middleware/verifyRole";

const router = express.Router();

router
  // .get("/available", verifyRoles("user"), handleFindAvailableTutorsByTime)
  // .get("/available/day", verifyRoles("user"), handleFindAvailableTutorsByDay)
  // .get("/available/week", verifyRoles("user"), handleFindAvailableTutorsByWeek)
  // .get("/:tutor_id", handleFindTutorByID)
  // .get("/", verifyRoles("user"), handleFindAllTutors);

  .get("/available", handleFindAvailableTutorsByTime)
  .get("/available/day", handleFindAvailableTutorsByDay)
  .get("/available/week", handleFindAvailableTutorsByWeek)
  .get("/:tutor_id", handleFindTutorByID)
  .get("/", handleFindAllTutors);

export default router;
