import express from "express";
import { handleZoomOauth } from "../controllers/zoomController";

const router = express.Router();

router.get("/", handleZoomOauth);

export default router;
