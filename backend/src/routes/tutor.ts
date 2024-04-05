import express from "express";
import {
  handleEditTutorProfile,
  handleFindAllTutors,
  handleFindAvailableTutorsByDay,
  handleFindAvailableTutorsByTime,
  handleFindAvailableTutorsByWeek,
  handleFindTutorByID,
  handleUpdateTutorProfile,
  handleUpdateProfilePicture,
} from "../controllers/tutorController";
import verifyRoles from "../middleware/verifyRole";
import upload from "../middleware/fileUpload";

const router = express.Router();

router
  .get("/available", verifyRoles("user"), handleFindAvailableTutorsByTime)
  .get("/available/day", verifyRoles("user"), handleFindAvailableTutorsByDay)
  .get("/available/week", verifyRoles("user"), handleFindAvailableTutorsByWeek)
  .get("/:tutorID", handleFindTutorByID)
  .get("/", verifyRoles("user"), handleFindAllTutors)
  .put("/profile/:tutorID", verifyRoles("tutor"), handleUpdateTutorProfile)
  .put("/edit/:tutorID", verifyRoles("tutor"), handleEditTutorProfile)
  .put(
    "/avatar/:tutorID",
    verifyRoles("tutor"),
    upload.single("profile_picture"),
    handleUpdateProfilePicture,
  );

export default router;
