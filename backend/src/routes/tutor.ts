import express from "express";
import {
  handleFindAllTutors,
  handleFindAvailableTutorsByDay,
  handleFindAvailableTutorsByTime,
  handleFindAvailableTutorsByWeek,
  handleFindTutorByID,
  handleUpdateTutorProfile,
} from "../controllers/tutorController";
import verifyRoles from "../middleware/verifyRole";

const router = express.Router();

router
  .get("/available", verifyRoles("user"), handleFindAvailableTutorsByTime)
  .get("/available/day", verifyRoles("user"), handleFindAvailableTutorsByDay)
  .get("/available/week", verifyRoles("user"), handleFindAvailableTutorsByWeek)
  .get("/:tutorID", handleFindTutorByID)
  .get("/", verifyRoles("user"), handleFindAllTutors)
  .put("/profile/:tutorID", verifyRoles("tutor"), handleUpdateTutorProfile)

export default router;
