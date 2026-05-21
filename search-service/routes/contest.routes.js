import express from "express";
import { getContests } from "../controllers/contest.controller.js";
import { isAuthenticated } from "../middleware/search.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getContests);

export default router;