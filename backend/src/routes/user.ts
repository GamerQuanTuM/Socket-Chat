import express from "express";
import { getUserDetails } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router()

router.post("/get-user-details", isAuthenticated, getUserDetails)

export default router

