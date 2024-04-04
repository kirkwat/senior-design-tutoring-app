import express from "express";
import verifyRoles from "../middleware/verifyRole";
import {
  handleFindStudentByID,
  handleUpdateStudentProfile,
} from "../controllers/studentController";

const router = express.Router();

router
  .get("/:studentID", handleFindStudentByID)
  .put("/profile/:studentID", verifyRoles("user"), handleUpdateStudentProfile);

export default router;
