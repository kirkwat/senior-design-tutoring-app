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
  // .get("/available", verifyRoles("user"), handleFindAvailableTutorsByTime)
  // .get("/available/day", verifyRoles("user"), handleFindAvailableTutorsByDay)
  // .get("/available/week", verifyRoles("user"), handleFindAvailableTutorsByWeek)
  // .get("/:tutorID", handleFindTutorByID)
  // .get("/", verifyRoles("user"), handleFindAllTutors)
  // .put("/profile/:tutorID", verifyRoles("tutor"), handleUpdateTutorProfile)

  .get("/available", handleFindAvailableTutorsByTime)
  .get("/available/day", handleFindAvailableTutorsByDay)
  .get("/available/week", handleFindAvailableTutorsByWeek)
  .get("/:tutorID", handleFindTutorByID)
  .get("/", handleFindAllTutors)
  .put("/profile/:tutorID", handleUpdateTutorProfile)

export default router;
