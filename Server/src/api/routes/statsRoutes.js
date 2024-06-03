// routes/statsRoutes.js
import express from "express";
import { getUsersCount, getEventsCount, getDonationsCount, getJobsCount } from "../controllers/statsController.js";

const router = express.Router();

router.get("/users/count", getUsersCount);
router.get("/events/count", getEventsCount);
router.get("/donations/count", getDonationsCount);
router.get("/jobs/count", getJobsCount);

export default router;
