import express from "express";
import {
  handleGetZoomConnection,
  handleZoomOauth,
} from "../controllers/zoomController";
import verifyJWT from "../middleware/verifyJWT";
import verifyRoles from "../middleware/verifyRole";

const router = express.Router();

router
  .get("/", handleZoomOauth)
  .get(
    "/connection/:tutorID",
    verifyJWT,
    verifyRoles("tutor"),
    handleGetZoomConnection,
  );

export default router;
