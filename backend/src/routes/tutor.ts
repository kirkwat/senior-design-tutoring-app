import express from "express";
import {
  handleEditTutorProfile,
  handleGetAllTutors,
  handleFindTutorByID,
  handleUpdateProfilePicture,
} from "../controllers/tutorController";
import verifyRoles from "../middleware/verifyRole";
import upload from "../middleware/fileUpload";

const router = express.Router();

router
  .put("/edit/:tutorID", verifyRoles("tutor"), handleEditTutorProfile)
  .put(
    "/avatar/:tutorID",
    verifyRoles("tutor"),
    upload.single("profile_picture"),
    handleUpdateProfilePicture,
  )
  .get("/:tutorID", handleFindTutorByID)
  .get("/", verifyRoles("user"), handleGetAllTutors);

export default router;
