import express from "express";
import { handleFindAllTutors } from "../controllers/tutorController";

const router = express.Router();

router.get("/", handleFindAllTutors);

export default router;