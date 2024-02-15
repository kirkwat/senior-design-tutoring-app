import express from "express";
import { handleFindTutorByID } from "../controllers/tutorController";

const router = express.Router();

router.get("/", handleFindTutorByID);

export default router;