import express from "express";
import {
  handleEditTutorProfile,
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
  .put("/edit/:tutorID", verifyRoles("tutor"), handleEditTutorProfile);

// .get("/available", handleFindAvailableTutorsByTime)
// .get("/available/day", handleFindAvailableTutorsByDay)
// .get("/available/week", handleFindAvailableTutorsByWeek)
// .get("/:tutorID", handleFindTutorByID)
// .get("/:tutorID/subjects", handleFindTutorsSubjects)
// .get("/", handleFindAllTutors)
// .put("/profile/:tutorID", handleUpdateTutorProfile)

export default router;
